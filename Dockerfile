#Базовый образ
FROM node:lts
#Мета-данные
LABEL author="DanilSord" \
      version="1"
#Устанавливает рабочий каталог для последующих инструкций
WORKDIR /app
COPY package*.json ./
#Выполнение команды в shell форме, установка зависиммостей npm
RUN npm install
COPY . .
EXPOSE 80
EXPOSE 443
#Команда выполняемая при запуске образа.
CMD [ "npm", "start" ]
