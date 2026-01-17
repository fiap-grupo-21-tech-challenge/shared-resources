FROM node:20-alpine

# Instalamos um servidor estático simples do Node
RUN npm install -g serve

WORKDIR /app

# Copiamos o conteúdo da sua pasta src para dentro do container
COPY ./src .

EXPOSE 8080

# -s: Single Page App mode (redireciona rotas para o index.html)
# -l: Porta onde vai rodar
CMD ["serve", "-s", ".", "-l", "8080"]