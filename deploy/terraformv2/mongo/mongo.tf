provider "aws" {
    region = "eu-west-2"
}

# Define la nube virtual privada principal (VPC)
resource "aws_vpc" "mainlb" {
    cidr_block = "10.0.0.0/16"

    tags = {
      Name = "wichat-mainlb"
    }
}

# Crea una subred pública dentro de la VPC
resource "aws_subnet" "public_subnet" {
    vpc_id                  = aws_vpc.mainlb.id
    cidr_block              = "10.0.1.0/24"
    availability_zone       = "eu-west-2a"
    map_public_ip_on_launch = true

    tags = {
      Name = "wichat-subnet-1"
    }
}

# Adjuntar una puerta de enlace, con salida a Internet, a la VPC
resource "aws_internet_gateway" "mainlb" {
    vpc_id = aws_vpc.mainlb.id
}

# Crea una tabla de rutas para la VPC
resource "aws_route_table" "mainlb" {
    vpc_id = aws_vpc.mainlb.id

    tags = {
      Name = "wichat-rtb"
    }
}

# Agrega una ruta a la puerta de enlace de Internet en la tabla de rutas
resource "aws_route" "route_to_igw" {
    route_table_id         = aws_route_table.mainlb.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id             = aws_internet_gateway.mainlb.id
}

# Asocia la primera subred pública con la tabla de rutas
resource "aws_route_table_association" "public_assoc_1" {
    subnet_id      = aws_subnet.public_subnet.id
    route_table_id = aws_route_table.mainlb.id
}

resource "aws_security_group" "mongodb_sg" {
  name        = "mongodb-sg"
  description = "Permitir solo acceso interno al puerto MongoDB"
  vpc_id      = aws_vpc.mainlb.id

  ingress {
    from_port   = 27017
    to_port     = 27017
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

# EC2 dedicada a MongoDB
resource "aws_instance" "mongodb" {
  ami                         = "ami-0ed841a51405c4675"
  instance_type               = "m4.large"
  subnet_id                   = aws_subnet.public_subnet.id
  vpc_security_group_ids      = [aws_security_group.mongodb_sg.id]
  associate_public_ip_address = true
  key_name                    = "wichat-es4a"

  root_block_device {
      volume_size = 16
      volume_type = "gp2"
  }

  user_data = <<-EOF
#!/bin/bash
docker start mongodb-wichat_es4a
EOF

  tags = {
    Name = "WiChat_MongoDB"
  }
}

output "mongodb_public_ip" {
  value = aws_instance.mongodb.public_ip
  description = "IP pública de MongoDB para configurar manualmente el resto de infraestructura"
}