provider "aws" {
    region = "eu-west-2"
}

resource "aws_security_group" "allow_ssh" {
    name        = "allow_ssh"
    description = "Allow SSH and WiChat ports"

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

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "my_instance" {
    ami               = "ami-0a94c8e4ca2674d5a"
    instance_type     = "t2.micro"
    key_name          = "wichat-es4a"
    security_groups   = [aws_security_group.allow_ssh.name]

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

resource "aws_eip" "my_eip" {
    instance  = aws_instance.my_instance.id
    domain    = "vpc"

    lifecycle {
        prevent_destroy = true
    }
}
