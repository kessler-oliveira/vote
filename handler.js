'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

const VOTES_TABLE = process.env.VOTES_TABLE;
const AGREGATE_VOTES_TABLE = process.env.AGREGATE_VOTES_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.vote = (event, context, callback) => {
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };

  var data = JSON.parse(event.body);
  data.id = uuid.v1();

  const params = {
    TableName: VOTES_TABLE,
    Item: data
  };

  const params_av = {
    TableName: AGREGATE_VOTES_TABLE,
  };

  dynamoDb.scan(params_av, (error, data) => {

    if (error) {
      response.statusCode = 500;
      response.body = JSON.stringify({ error: "Could not save vote" });
      callback(null, response);
    } else if (data.Items) {
      var keys = data.Items.map(function(item) {
        return item.vote;
      });

      if(data.Count < 3) {
        dynamoDb.put(params, (error) => {
          if (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({ error: "Could not save vote" });
      
            callback(null, response);
          }
          response.body = JSON.stringify({ message: "Vote saved successfully" });
          callback(null, response);
        });
      } else if (keys.includes(params.item.vote)) {
        dynamoDb.put(params, (error) => {
          if (error) {
            response.statusCode = 500;
            response.body = JSON.stringify({ error: "Could not save vote" });
      
            callback(null, response);
          }
          response.body = JSON.stringify({ message: "Vote saved successfully" });
          callback(null, response);
        });
      } else {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: "it is possible to add up to 3 different votes", votes: keys });
      }
    } else {
      dynamoDb.put(params, (error) => {
        if (error) {
          response.statusCode = 500;
          response.body = JSON.stringify({ error: "Could not save vote" });
    
          callback(null, response);
        }
        response.body = JSON.stringify({ message: "Vote saved successfully" });
        callback(null, response);
      });
    }
  });
}

module.exports.trigger = (event, context, callback) => {

  console.log(event);

  const params = {
    TableName: VOTES_TABLE,
    FilterExpression : 'vote = :name',
    ExpressionAttributeValues : {':name' : event.Records[0].dynamodb.NewImage.vote.S}
  };

  console.log(params);

  dynamoDb.scan(params, (error, data) => {

    var vote = {
      'vote': event.Records[0].dynamodb.NewImage.vote.S,
      'count': data.Count
    };

    console.log(vote);

    const insert = {
      TableName: AGREGATE_VOTES_TABLE,
      Item: vote
    };

    dynamoDb.put(insert, (error) => {
      if (error) {
        console.log("Could not save vote in trigger" );
      } else {
        console.log({ message: "Vote saved successfully in trigger" });
      }
    });
  });
}

module.exports.votes = (event, context, callback) => {
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };

  const params = {
    TableName: AGREGATE_VOTES_TABLE,
  };

  dynamoDb.scan(params, (error, data) => {

    if (error) {
      response.statusCode = 500;
      response.body = JSON.stringify({ error: "Could not retrieve votes" });
    } else if (data.Items) {
      response.body = JSON.stringify(data.Items);
    } else {
      response.body = JSON.stringify({ message: "Has no votes" });
    }

    callback(null, response);
  });
}

module.exports.clean = (event, context, callback) => {
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };

  response.body = JSON.stringify({ message: "Votes cleaned successfully" });

  const params_av = {
    TableName: AGREGATE_VOTES_TABLE,
  };

  dynamoDb.scan(params_av, (error, data) => {

    if (error) {
      response.statusCode = 500;
      response.body = JSON.stringify({ error: "Could not clean votes" });
      callback(null, response);
    } else if (data.Items) {

      data.Items.forEach(function(item) {
        const params_avt = {
          TableName : AGREGATE_VOTES_TABLE,
          Key: {
            vote: item.vote
          }
        };

        dynamoDb.delete(params_avt, (error, data) => {
          if (error) {
            response.body = JSON.stringify({ message: "Some votes has no clean" });
            callback(null, response);
          }
        });
      });
    } else {
      response.body = JSON.stringify({ message: "Has no votes" });
      callback(null, response);
    }
  });

  const params_v = {
    TableName: VOTES_TABLE,
  };

  dynamoDb.scan(params_v, (error, data) => {

    if (error) {
      response.statusCode = 500;
      response.body = JSON.stringify({ error: "Could not clean votes" });
      callback(null, response);
    } else if (data.Items) {

      data.Items.forEach(function(item) {
        const params_vt = {
          TableName : VOTES_TABLE,
          Key: {
            id: item.id
          }
        };

        dynamoDb.delete(params_vt, (error, data) => {
          if (error) {
            response.body = JSON.stringify({ message: "Some votes has no clean" });
            callback(null, response);
          }
        });
      });
    } else {
      response.body = JSON.stringify({ message: "Has no votes" });
      callback(null, response);
    }
  });

  callback(null, response);
}