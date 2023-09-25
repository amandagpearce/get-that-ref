# Get that ref

Projeto criado como componente A do MVP da disciplina de Back-end avançado do curso de pós-graduação em Desenvolvimento Full Stack da PUC-Rio. 

## O que é?
Front-end construído com Next.js e Material UI para busca e envio de referências de Artes Visuais em séries de tv e filmes. 
Utiliza o S3 da Amazon para armazenamento de imagens enviadas pelo formulário da página "Send a reference" (detalhes mais abaixo em "Features").
Utiliza também os componentes [B - Art Refs API](https://github.com/amandagpearce/art-refs-api), [C - Auth Service](https://github.com/amandagpearce/auth-service), [D - Google Image Service](https://github.com/amandagpearce/google-image-service) criados em conjunto com este trabalho.

---
## Arquivo .env
É necessário a criação de um arquivo .env tanto para rodar o projeto com Docker quanto sem. 
Após ter as informações do S3 descritas abaixo, crie um arquivo chamado `.env` com o seguinte conteúdo:

```bash

NEXT_PUBLIC_ART_REFS_API_URL=http://127.0.0.1:4000
AWS_ACCESS_KEY_ID=stringaqui
AWS_SECRET_ACCESS_KEY=stringaqui
AWS_BUCKET_NAME=stringaqui
AWS_REGION=stringaqui
```
- Substitua `stringaqui` pelas suas informações do S3. 
- `NEXT_PUBLIC_ART_REFS_API_URL` é a url onde deve estar rodando o serviço [B - Art Refs API](https://github.com/amandagpearce/art-refs-api).
- Documentação do S3 para obter Access Key Id, Secret Access Key, Bucket Name e Region [aqui](https://docs.aws.amazon.com/pt_br/AmazonS3/latest/userguide/configuring-bucket-key.html).

---
## Instalação com Docker
1. Clone o projeto
2. Cole o arquivo `.env` preenchido e descrito na seção anterior na raiz do projeto.
3. Na raiz do projeto, crie a imagem:
```bash
  docker build -t got-that-ref .
```

4. Rode a imagem criada:
```bash
  docker run -p 3000:3000 got-that-ref
```

## Instalação sem Docker
1. Clone o projeto
2. Cole o arquivo `.env` preenchido e descrito na seção anterior na raiz do projeto.
3. Na raiz do projeto, rode o comando:
```bash
  npm run dev
```

## Features
### Home
Na home é exibida uma listagem de filmes e séries que possuem referencias cadastradas. Todas as operações (exceto da busca/inclusão da imagem da obra de arte referenciada) em filmes, séries e referências são executadas através de uma [API Graphql](https://github.com/amandagpearce/art-refs-api) também desenvolvida para este trabalho. 
![Home](https://raw.githubusercontent.com/amandagpearce/got-that-ref/main/doc/1.png)
### Search by title
No header é possível fazer a busca pelo título da série ou filme. 

![Search by title](https://raw.githubusercontent.com/amandagpearce/got-that-ref/main/doc/2.png)

### Visual Art References
Ao clicar em um item da listagem na home, são exibidas as informações sobre as referências. A imagem da esquerda é a que foi enviada pelo formulário "Send a reference" e a imagem da direita é retornada por uma [API Rest](https://github.com/amandagpearce/google-image-service) que se comunica com [a API Graphql](https://github.com/amandagpearce/art-refs-api), ambas desenvolvidas para este trabalho. 

![Visual Art References](https://raw.githubusercontent.com/amandagpearce/got-that-ref/main/doc/3.png)

### Login/Signup/Change password
Login/Signup/Logout/Mudança de senha implementados com [API rest](https://github.com/amandagpearce/auth-service) também desenvolvida para este trabalho. 

![Login/Signup](https://raw.githubusercontent.com/amandagpearce/got-that-ref/main/doc/4.png)

![Change password](https://raw.githubusercontent.com/amandagpearce/got-that-ref/main/doc/6.png)

### Admin account
Na conta de tipo admin é possível visualizar uma lista com as referências que foram enviadas. É possível editar a referencia para incluir mais informações, aprovar ou rejeitar e as operações no banco de dados ficam a cargo da [API Graphql](https://github.com/amandagpearce/art-refs-api) também desenvolvida para este trabalho. 

![Admin account](https://raw.githubusercontent.com/amandagpearce/got-that-ref/main/doc/5.png)


### Send a reference 
Formulário para envio da referência em um filme ou série com opção de enviar uma imagem da cena onde aparece a referência. A funcionalidade autocomplete no campo título utiliza uma query da [API Graphql](https://github.com/amandagpearce/art-refs-api) também desenvolvida para este trabalho. 

![Send a reference ](https://raw.githubusercontent.com/amandagpearce/got-that-ref/main/doc/7.png)

