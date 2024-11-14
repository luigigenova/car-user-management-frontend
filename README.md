# car-user-management-frontend
Este repositório será responsável pela interface em Angular, fornecendo uma aplicação front-end com Angular Material para autenticação, cadastro e consulta de usuários e carros, com integração aos endpoints do backend.

## Estórias de Usuário

1. Tela de Cadastro de Usuário: Como um usuário, quero ter uma interface onde posso preencher meus dados para realizar o cadastro no sistema.
2. Tela de Login: Como um usuário, quero uma tela de login onde eu possa entrar no sistema com login e senha.
3. Tela de Listagem de Carros: Como um usuário autenticado, quero ver uma lista dos meus carros cadastrados.
4. Formulário de Cadastro de Carro: Como um usuário autenticado, quero uma tela para adicionar novos carros ao meu perfil.
5. Atualização de Dados: Como um usuário, quero poder atualizar meus dados pessoais e de carros pela interface.
6. Remoção de Carro: Como um usuário, quero poder remover um carro específico pela interface.

## Solução

A aplicação será desenvolvida usando Angular com os seguintes recursos:
- Angular Material para uma interface responsiva e amigável.
- Integração com Backend via HTTP para consumir as APIs do projeto Spring Boot.
- Autenticação JWT para gerenciar o acesso a áreas protegidas.
- Tratamento de Erros para exibir mensagens de erro claras e padronizadas.
- Interface CRUD Completa para cadastro e consulta de usuários e carros.

## Execução e Build

1. Clone o repositório: `git clone https://github.com/luigigenova/car-user-management-frontend.git`
2. Navegue até o diretório do projeto: `cd car-user-management-frontend`
3. Instale as dependências: `npm install`
4. Execute a aplicação: `ng serve`
5. Acesse a interface em `http://localhost:4200`

## Deploy e Testes

- Deploy: Instruções para deploy do front-end serão adicionadas conforme a plataforma escolhida.
- Testes Unitários: Para executar os testes, utilize o comando: `ng test`
