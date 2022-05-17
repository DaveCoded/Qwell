# Qwell

## curl

When running the api locally, you can query it with curl:

```sh
curl --request POST \
  --header 'content-type: application/json' \
  --url http://localhost:4000/api \
  --data '{"query":"query { __typename }"}'
```
