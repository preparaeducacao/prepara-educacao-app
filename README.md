# GUIA DE INSTALAÇÃO #

### Requisitos: ###

#### Documentação Geral ####
    https://docs.expo.dev/

- **NODEJS**: É necessário ter o Node.js instalado. Você pode baixá-lo [aqui](https://nodejs.org/dist/latest-v16.x/) (versão 16.20 ou superior).
- **EXPO-CLI**: Instale o Expo CLI globalmente executando o comando `npm install -g expo-cli` no seu terminal.
- **Dispositivo Móvel**: Certifique-se de ter um dispositivo móvel com o aplicativo Expo Go instalado. O Expo Go está disponível na [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) para dispositivos Android ou na [Apple App Store](https://apps.apple.com/us/app/expo-go/id982107779) para dispositivos iOS.

### Configuração do Projeto ###

1. Após instalar os requisitos acima, navegue até o diretório do seu projeto no terminal.
2. Execute os seguintes comandos para configurar o ambiente do projeto:
    ```bash
    npm install
    npx expo install
    npx expo
    ```
3. Ao final, um QR-CODE será exibido. Utilize o aplicativo Expo Go no seu dispositivo móvel para escanear este código e visualizar o projeto.

### Informações para BUILD do Projeto ###

#### Verificação do Pacote ####

Antes de realizar o build, é importante verificar se está tudo correto com o pacote. Para isso, execute o comando:
```bash
npx expo prebuild --no-install --platform <plataforma>
```

#### Builds Segmentados ####

Você pode criar builds segmentados por ambiente, como preview, desenvolvimento ou produção.

##### Preview do Projeto #####

Se deseja apenas criar uma prévia do projeto, utilize o seguinte comando:
```bash
eas build --profile preview --platform <plataforma>
```

##### Publicação em Produção #####

- **ANDROID**:
  ```bash
  eas build --platform android
  ```
- **IOS**:
  ```bash
  eas build --platform ios
  ```
- **TODOS**:
  ```bash
  eas build --platform all
  ```

#### Execução em Desenvolvimento ####

Para executar o projeto em um ambiente de desenvolvimento, utilize os seguintes comandos:

- **ANDROID**:
  ```bash
  npx expo run:android
  ```
- **IOS**:
  ```bash
  npx expo run:ios
  ```
- **EXPO QR-VIEW**:
  ```bash
  npx expo
  ```

#### EXPO ONLINE QR (Recomendado) ####

Para que os solicitantes acompanhem o desenvolvimento durante todo o projeto, utilize o seguinte comando:

- Para uma plataforma específica:
  ```bash
  eas update --branch [branch] --message [message]
  ```

- Para todas as plataformas:
  ```bash
  eas update --message [message]
  ```

### Repositório de Controle de Builds ###

Para mais detalhes sobre os builds realizados, acesse nosso [Repositório de Controle de Builds](https://expo.dev/accounts/preparaapp/projects/prepara-app).
