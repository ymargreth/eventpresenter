FROM alpine:3.20

RUN apk add --no-cache curl

WORKDIR /app
COPY fetch.sh .

RUN chmod +x fetch.sh

CMD ["./fetch.sh"]