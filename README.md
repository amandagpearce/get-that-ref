# Get that ref

Projeto criado como componente A do MVP da disciplina de Back-end avançado do curso de pós-graduação em Desenvolvimento Full Stack da PUC-Rio. 

## O que é?
Front-end construído com Next.js e Material UI para busca e envio de referências de Artes Visuais em séries de tv e filmes. 


## Rodando o projeto com Docker
1. Clone o projeto
2. Na raiz do projeto, crie a imagem:
```bash
  docker build -t got-that-ref .
```

3. Rode a imagem criada:
```bash
  docker run -p 3000:3000 got-that-ref
```

## Rodando o projeto sem Docker
1. Clone o projeto
2. Na raiz do projeto, rode o comando:
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
Ao clicar em um item da listagem na home, são exibidas as informações sobre as referências. 
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

