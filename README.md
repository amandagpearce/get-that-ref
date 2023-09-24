# Get that ref

Projeto criado como componente A do MVP da disciplina de Back-end avançado do curso de pós-graduação em Desenvolvimento Full Stack da PUC-Rio. 

## O que é?
Front-end construído com Next.js e Material UI para busca de referências de artes visuais em séries de tv. 


### Rodando o projeto com Docker
1. Clone o projeto
2. Na raiz do projeto, crie a imagem:
```bash
  docker build -t got-that-ref .
```

3. Rode a imagem criada:
```bash
  docker run -p 3000:3000 got-that-ref
```
