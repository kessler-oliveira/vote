# Vote

Voting API made with Serverless, Terraform and NodeJS, it is possible to add up to 3 different votes, view them aggregates and clear the votes.

## Requirements

Terraform v0.11.5 or later
+ provider.aws v1.11.0
+ provider.local v1.1.0

Node v4.2.6 or later
NPM 3.5.2 or later
Serverless 1.26.1 or later

AWS Account

## Getting Started

``` bash
$ git clone --depth 1 https://github.com/kessler-oliveira/vote.git
```

## Environment

``` bash
AWS_ACCESS_KEY_ID="ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="SECRET_KEY"
```

## Installation

``` bash
$ terraform init
$ terraform apply
$ sls deploy
```

## How to use

### List Agregation Votes

``` bash
$ curl https://XXXX.execute-api.region.amazonaws.com/dev/votes
```

### Add Vote

``` bash
$ curl -X POST https://XXXX.execute-api.region.amazonaws.com/dev/vote --data '{ "vote" : "XXX" }'
```

### Clean Votes

``` bash
$ curl https://XXXX.execute-api.region.amazonaws.com/dev/votes/clean
```

## Remove

``` bash
$ sls remove
$ terraform destroy
```