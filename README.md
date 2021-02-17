Integration service (IS) is deployed at https://opt-integration-service.herokuapp.com/

IS is receiving orders at /api/orders

If IS receives invalid order, order will be saved to database with highlighted errors but it won't be send to OPT.

IS is asking OPT for order state every one minute. Unfinished and unpatched orders are fetched from database every
one minute, so it will work even if IS or Partner sevices fails.