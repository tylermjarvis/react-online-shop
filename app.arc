@app
begin-with-stripe

@http
get /
get /products
post /checkout-session
options /checkout-session

@static
