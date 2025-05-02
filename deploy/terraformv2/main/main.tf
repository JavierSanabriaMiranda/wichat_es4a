provider "aws" {
    region = "eu-west-2"
}

# Reutiliza la VPC, subred, e IGW creados por mongo.tf

data "aws_vpc" "mainlb" {
  filter {
    name   = "tag:Name"
    values = ["wichat-mainlb"]
  }
}

data "aws_subnet" "public_subnet" {
  filter {
    name   = "tag:Name"
    values = ["wichat-subnet-1"]
  }
}

data "aws_route_table" "mainlb" {
  filter {
    name   = "tag:Name"
    values = ["wichat-rtb"]
  }
}

# Crea otra subred pública dentro de la VPC
resource "aws_subnet" "public_subnet_2" {
    vpc_id                  = data.aws_vpc.mainlb.id
    cidr_block              = "10.0.2.0/24"
    availability_zone       = "eu-west-2c"
    map_public_ip_on_launch = true
}

# Asocia la segunda subred pública con la tabla de rutas
resource "aws_route_table_association" "public_assoc_2" {
    subnet_id      = aws_subnet.public_subnet_2.id
    route_table_id = data.aws_route_table.mainlb.id
}

# Define un grupo de seguridad para permitir puertos SSH y los utilizados en WiChat
resource "aws_security_group" "instance_sg" {
    name        = "wichat-instance-sg"
    description = "Permitir SSH y puertos WiChat"
    vpc_id      = data.aws_vpc.mainlb.id

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

    ingress {
        from_port   = 8006
        to_port     = 8006
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
    vpc_id      = data.aws_vpc.mainlb.id

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
    subnets            = [data.aws_subnet.public_subnet.id, aws_subnet.public_subnet_2.id]

    enable_deletion_protection = false
    tags = { Name = "web-lb" }
}

# Target Group para ALB
resource "aws_lb_target_group" "web_tg" {
    name     = "web-tg"
    port     = 3000
    protocol = "HTTP"
    vpc_id   = data.aws_vpc.mainlb.id

    health_check {
        path                = "/"
        port                = "3000"
        protocol            = "HTTP"
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

# Instancias EC2 manuales
resource "aws_instance" "wichat_instances" {
  count                  = 2
  ami                    = "ami-0a94c8e4ca2674d5a"
  instance_type          = "m4.large"
  subnet_id              = element([data.aws_subnet.public_subnet.id, aws_subnet.public_subnet_2.id], count.index % 2)
  vpc_security_group_ids = [aws_security_group.instance_sg.id]
  associate_public_ip_address = true
  key_name               = "wichat-es4a"

    root_block_device {
        volume_size = 16
        volume_type = "gp2"
    }

    user_data = <<-EOF
        #!/bin/bash
        sudo apt update
        sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
        sudo apt update
        sudo apt install docker-ce -y
        sudo usermod -aG docker ubuntu
    EOF

  tags = {
    Name = "WiChat_Instance_${count.index}"
  }
}

# Asociar instancias al Target Group
resource "aws_lb_target_group_attachment" "attachments" {
  count            = 2
  target_group_arn = aws_lb_target_group.web_tg.arn
  target_id        = aws_instance.wichat_instances[count.index].id
  port             = 3000
}