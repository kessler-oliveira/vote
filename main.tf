provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "votes" {
  name             = "votes"
  hash_key         = "id"
  read_capacity    = 1
  write_capacity   = 1
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "agregate-votes" {
  name           = "agregate-votes"
  hash_key       = "vote"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "vote"
    type = "S"
  }
}

resource "local_file" "stream_arn" {
    content  = "stream: ${aws_dynamodb_table.votes.stream_arn}"
    filename = "stream_arn.yml"
}