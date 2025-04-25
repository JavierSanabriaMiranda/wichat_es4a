provider "aws" {
    region = "eu-west-2"
}

# Define la nube virtual privada principal (VPC)
resource "aws_vpc" "main" {
    cidr_block = "10.0.0.0/16"
}

# Crea una subred pública dentro de la VPC
resource "aws_subnet" "public_subnet" {
    vpc_id                  = aws_vpc.main.id
    cidr_block              = "10.0.1.0/24"
    availability_zone       = "eu-west-2a"
    map_public_ip_on_launch = true
}

# Crea otra subred pública dentro de la VPC
resource "aws_subnet" "public_subnet_2" {
    vpc_id                  = aws_vpc.main.id
    cidr_block              = "10.0.2.0/24"
    availability_zone       = "eu-west-2b"
    map_public_ip_on_launch = true
}

# Adjuntar una puerta de enlace, con salida a Internet, a la VPC
resource "aws_internet_gateway" "main" {
    vpc_id = aws_vpc.main.id
}

# Crea una tabla de rutas para la VPC
resource "aws_route_table" "main" {
    vpc_id = aws_vpc.main.id
}

# Agrega una ruta a la puerta de enlace de Internet en la tabla de rutas
resource "aws_route" "route_to_igw" {
    route_table_id         = aws_route_table.main.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id             = aws_internet_gateway.main.id
}

# Asocia la primera subred pública con la tabla de rutas
resource "aws_route_table_association" "public_assoc_1" {
    subnet_id      = aws_subnet.public_subnet.id
    route_table_id = aws_route_table.main.id
}

# Asocia la segunda subred pública con la tabla de rutas
resource "aws_route_table_association" "public_assoc_2" {
    subnet_id      = aws_subnet.public_subnet_2.id
    route_table_id = aws_route_table.main.id
}

# Define un grupo de seguridad para permitir puertos SSH y los utilizados en WiChat
resource "aws_security_group" "allow_ssh" {
    name        = "allow_ssh"
    description = "Permitir SSH y puertos WiChat"
    vpc_id      = aws_vpc.main.id

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
  
    ingress {
        from_port   = 3000
        to_port     = 3000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port   = 8000
        to_port     = 8000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port   = 8001
        to_port     = 8001
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port   = 8002
        to_port     = 8002
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port   = 8003
        to_port     = 8003
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port   = 8004
        to_port     = 8004
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port   = 8005
        to_port     = 8005
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# Define un grupo de seguridad para permitir puerto 80 al LB
resource "aws_security_group" "lb_sg" {
    name        = "lb-sg"
    description = "Allow HTTP"
    vpc_id      = aws_vpc.main.id

    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# Application Load Balancer
resource "aws_lb" "web_lb" {
    name               = "web-lb"
    internal           = false
    load_balancer_type = "application"
    security_groups    = [aws_security_group.lb_sg.id]
    subnets            = [aws_subnet.public_subnet.id, aws_subnet.public_subnet_2.id]

    enable_deletion_protection = false
    tags = { Name = "web-lb" }
}

# Target Group para ALB
resource "aws_lb_target_group" "web_tg" {
    name     = "web-tg"
    port     = 80
    protocol = "HTTP"
    vpc_id   = aws_vpc.main.id

    health_check {
        path                = "/"
        interval            = 30
        timeout             = 5
        healthy_threshold   = 5
        unhealthy_threshold = 2
        matcher             = "200"
    }
}

# Listener del ALB
resource "aws_lb_listener" "web_listener" {
    load_balancer_arn = aws_lb.web_lb.arn
    port              = 80
    protocol          = "HTTP"

    default_action {
        type             = "forward"
        target_group_arn = aws_lb_target_group.web_tg.arn
    }
}

# Script de arranque para instancias ASG
locals {
  user_data_script = <<-EOF
#!/bin/bash
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce -y
sudo usermod -aG docker ubuntu
EOF
}

# Launch Template para ASG
resource "aws_launch_template" "web_config" {
    name_prefix            = "web-template-"
    image_id               = "ami-0a94c8e4ca2674d5a"
    instance_type          = "t3.medium"
    key_name               = "wichat-es4a"
    vpc_security_group_ids = [aws_security_group.allow_ssh.id]

    user_data = base64encode(local.user_data_script)
    tag_specifications {
        resource_type = "instance"
        tags = { Name = "WiChat_ASG_Instance" }
    }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "asg" {
    name                      = "wi-chat-asg"
    desired_capacity          = 2
    max_size                  = 5
    min_size                  = 2
    vpc_zone_identifier       = [aws_subnet.public_subnet.id, aws_subnet.public_subnet_2.id]

    launch_template {
        id      = aws_launch_template.web_config.id
        version = "$Latest"
    }

    target_group_arns         = [aws_lb_target_group.web_tg.arn]
    health_check_type         = "ELB"
    health_check_grace_period = 300

    tags = [{
        key                 = "Name"
        value               = "WiChat_ASG_Instance"
        propagate_at_launch = true
    }]
}

# SNS Topic para notificaciones de alarma
resource "aws_sns_topic" "network_in_alarm_topic" {
    name = "network_in_alarm_topic"
}

resource "aws_sns_topic_subscription" "network_in_alarm_email_subscription" {
    topic_arn = aws_sns_topic.network_in_alarm_topic.arn
    protocol  = "email"
    endpoint  = "aitorcius2004@gmail.com"
}

# Políticas de Auto Scaling
resource "aws_autoscaling_policy" "scale_up_policy" {
    name                   = "scale_up"
    autoscaling_group_name = aws_autoscaling_group.asg.name
    adjustment_type        = "ChangeInCapacity"
    scaling_adjustment     = 1
    cooldown               = 300
}

resource "aws_autoscaling_policy" "scale_down_policy" {
    name                   = "scale_down"
    autoscaling_group_name = aws_autoscaling_group.asg.name
    adjustment_type        = "ChangeInCapacity"
    scaling_adjustment     = -1
    cooldown               = 300
}

# Alarmas de CloudWatch para NetworkIn
resource "aws_cloudwatch_metric_alarm" "network_in_high_alarm" {
    alarm_name                = "High_Network_In_Alarm"                                         # Nombre de la alarma
    comparison_operator       = "GreaterThanThreshold"                                          # Operador de comparación para el umbral
    evaluation_periods        = 1                                                               # Número de periodos para la evaluación
    metric_name               = "NetworkIn"                                                     # Métrica para tráfico de red entrante
    namespace                 = "AWS/EC2"                                                       # Espacio de nombres de la métrica
    period                    = 60                                                              # Periodo de comprobación en segundos
    statistic                 = "Sum"                                                           # Estadística utilizada para la métrica
    threshold                 = 10000000                                                        # Umbral de tráfico en bytes
    alarm_description         = "Alarm when network inbound traffic exceeds 10MB in 1 minute"   # Descripción de la alarma
    dimensions                = {
        AutoScalingGroupName = aws_autoscaling_group.asg.name  # Dimensión de la métrica (ID de la instancia, en este caso, AutoScalingGrup)
    }

    actions_enabled           = true                                          # Habilitar acciones de alarma
    alarm_actions             = [aws_autoscaling_policy.scale_up_policy.arn]  # Acciones a realizar cuando se active la alarma
}

resource "aws_cloudwatch_metric_alarm" "network_in_low_alarm" {
    alarm_name                = "Low_Network_In_Alarm"                                            # Nombre de la alarma
    comparison_operator       = "LessThanThreshold"                                               # Operador de comparación para el umbral
    evaluation_periods        = 1                                                                 # Número de periodos para la evaluación
    metric_name               = "NetworkIn"                                                       # Métrica para tráfico de red entrante
    namespace                 = "AWS/EC2"                                                         # Espacio de nombres de la métrica
    period                    = 60                                                                # Periodo de comprobación en segundos
    statistic                 = "Sum"                                                             # Estadística utilizada para la métrica
    threshold                 = 5000000                                                           # Umbral de tráfico en bytes (ajusta según tu necesidad)
    alarm_description         = "Alarm when network inbound traffic falls below 5MB in 1 minute"  # Descripción de la alarma
    dimensions                = {
        AutoScalingGroupName = aws_autoscaling_group.asg.name  # Dimensión de la métrica (ID de AutoScalingGroup)
    }

    actions_enabled           = true                                          # Habilitar acciones de alarma
    alarm_actions             = [aws_autoscaling_policy.scale_down_policy.arn]  # Acciones a realizar cuando se active la alarma
}