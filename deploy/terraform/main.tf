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

# Asocia la subred pública con la tabla de rutas
resource "aws_route_table_association" "public_association" {
    subnet_id      = aws_subnet.public_subnet.id
    route_table_id = aws_route_table.main.id
}

# Define un grupo de seguridad para permitir puertos SSH y los utilizados en WiChat
resource "aws_security_group" "allow_ssh" {
    name        = "allow_ssh"
    description = "Permitir puertos SSH y WiChat"
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

# Lanza una instancia EC2 con Docker instalado
resource "aws_instance" "my_instance" {
    ami                    = "ami-0a94c8e4ca2674d5a"
    instance_type          = "m4.large"
    key_name               = "wichat-es4a"
    subnet_id              = aws_subnet.public_subnet.id
    vpc_security_group_ids = [aws_security_group.allow_ssh.id]

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
        Name = "WiChat_Instance"
    }
}
