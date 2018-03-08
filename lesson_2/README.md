# Develop serverless application using AWS Cli

## Problem in Lesson 1
We need a practical way to able to develop serverless application in a "common sense" way of engineering, for example, develop, contributing, testing, deploy. Not directly on AWS console.

## Solution
[AWS cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
[Cli reference](https://docs.aws.amazon.com/cli/latest/reference/)

* IAM
```
aws iam create-role --role-name Test-Role-for-Lession2 --assume-role-policy-document file://src/trustpolicy.json

aws iam put-role-policy --role-name Test-Role-for-Lession2 --policy-name Permissions-Policy-For-Lession2 --policy-document file://src/permissionspolicy.json
```
**Note** Do write down role arn for feature usage

* DyanmoDB
```
aws dynamodb create-table \
    --table-name Users \
    --attribute-definitions \
        AttributeName=mobile,AttributeType=S \
    --key-schema AttributeName=mobile,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
```

* Lambda
[Reference](https://docs.aws.amazon.com/lambda/latest/dg/with-userapp-walkthrough-custom-events-create-nodejs-function.html)
    * Create zip file
    ```
    cd src
    zip -r ../getUser.zip getUserImproved.js
    ```
    * Create lambda function
    ```
    aws lambda create-function \
        --region eu-central-1 \
        --function-name getUser \
        --zip-file fileb://getUser.zip \
        --role arn:aws:iam::268255856831:role/Test-Role-for-Lession2 \
        --handler getUserImproved.handler \
        --runtime nodejs6.10
    ```
    * Run
    * Dig into configurations
**Note** Do write down lambda arn for feature usage

* API Gateway
    We create an api GET /users
    * Create api
    ```
    aws apigateway create-rest-api --name 'User services' --region eu-central-1
    ```
    **Note** write down api 

    ```
    aws apigateway get-resources --rest-api-id {apiId} --region eu-central-1
    ```
    **Note** write down resource id

    * Create resource
    ```
    aws apigateway create-resource --rest-api-id {apiId} \
      --region eu-central-1 \
      --parent-id {resourceId} \
      --path-part users
    ```
    **Note** write down resource id

    * Add method
    ```
    aws apigateway put-method --rest-api-id {apiId} \
       --resource-id {resouceId} \
       --http-method GET \
       --authorization-type "NONE" \
       --region eu-central-1
    ```

    * Add integration
    ```
    aws apigateway put-integration \
        --region eu-central-1 \
        --rest-api-id jtktslv2u5 \
        --resource-id 6ohjb9 \
        --http-method POST \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri arn:aws:apigateway:eu-central-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-central-1:268255856831:function:getUser/invocations \
        --credentials arn:aws:iam::268255856831:role/APIGatewayAPIExecRole
    ```
    **Note** Please note APIExecRole, here. Tell the difference permission between create api definition and run api

    * Run, see permission error?
    * Because we didn't add permission to allow apigateway run lambda function
    ```
    aws lambda add-permission --function-name arn:aws:lambda:eu-central-1:268255856831:function:getUser --source-arn arn:aws:execute-api:eu-central-1:268255856831:jtktslv2u5/*/GET/users  --principal apigateway.amazonaws.com --statement-id lambdaPermission --action lambda:InvokeFunction
    ```
    * Still error? => BUG!!! Have to reconfigure integrtion endpoint in APIGateway console

## Conslusion

    It's not clumssy and error-prone to work in this way, but it's better than working directly in AWS console, it gives us a way to engineer serverless application in a way that everyone can contribute and can utilize other software engineering tools.

    But it's not enough, we need a better tool.

