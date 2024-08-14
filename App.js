import React, {useState, useEffect, useRef} from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Alert, LogBox, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';


LogBox.ignoreLogs(['new NativeEventEmitter']);

// const HOME_URL = 'http://10.0.0.128/perfil/entrar';
const HOME_URL = 'https://homologacao-prepara-educacao.vercel.app/';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [statePushToken, setStatePushToken] = useState('');
  const [stateUsername, setStateUsername] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [injectScript, setInjectScript] = useState('');

  const webViewRef = useRef(null);

  const injectedJavaScript = `
    (function() {
      // Desabilita gestos de zoom sem afetar a rolagem
      document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
          event.preventDefault(); // Bloqueia o gesto de zoom
        }
      }, { passive: false });

      // Evita que o duplo toque dê zoom
      var lastTouchEnd = 0;
      document.addEventListener('touchend', function(event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
    
      function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
        return null;
      }
    
      // Função para ler o cookie e enviar os dados de volta para o app
      function sendUserData() {
        var encodedData = getCookie('data_user_app');
        if (!encodedData) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ error: 'Cookie data_user_app não encontrado' }));
          return;
        }
    
        // Decodifica os dados de base64 para string
        var decodedData = atob(encodedData);
        try {
          // Tenta analisar a string decodificada como JSON
          var userData = JSON.parse(decodedData);
          window.ReactNativeWebView.postMessage(JSON.stringify(userData));
        } catch (e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ error: 'Erro ao analisar os dados do usuário: ' + e.toString() }));
        }
      }
    
      sendUserData();
      
    })(); 
    true; // final expression must evaluate to true
    `;

  const onNavigationStateChange = (navState) => {
    setIsLoading(navState.loading);
    // Verifica se a URL contém a palavra "entrar"
    if (!navState.url.includes("entrar")) {
      setInjectScript(injectedJavaScript);
    } else {
      setInjectScript('');
    }
  };

  const onWebViewMessage = (event) => {
    console.log('WebView LOG:', event.nativeEvent.data);
    // Captura os dados enviados pela WebView
    const data = JSON.parse(event.nativeEvent.data);
    if (data.error) {
      console.error('Erro:', data.error);
    } else {
      console.log('Dados do usuário:', data);
      setStateUsername(data.i);
    }
  };

  /*useEffect(() => {
    // Injeta o script JavaScript se necessário
    if (injectScript && webViewRef.current) {
      webViewRef.current.injectJavaScript(injectScript);
    }
  }, [injectScript]);*/

  /*useEffect(() => {

    if (stateUsername) {
      (async () => {
        const tokenStored = await checkForStoredToken();
        if (tokenStored) {
          console.log('Token encontrado:', tokenStored);
        } else {
          console.log('Nenhum token armazenado, iniciando registro de novo token!');
          await registerForPushNotificationsAsync().then(token => setStatePushToken(token));
          if(statePushToken) {
            await AsyncStorage.setItem('PUSH_TOKEN', statePushToken);
            console.log('Token registrado: ', {expoPushToken: statePushToken})
            console.log('Armazenando token em base de dados');
            await sendTokenAndUserData(statePushToken, stateUsername);
          }
        }
      })();
    }

    return () => {
      // Cleanup
    };
  }, [stateUsername, statePushToken]);*/

  /*useEffect(() => {
    // Função para tratar o evento de pressionar o botão de voltar
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack(); // Chama o método goBack() da WebView
        return true; // Impede a ação padrão de voltar do dispositivo
      }
      return false;
    };

    // Adiciona o event listener para o botão de voltar
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Remove o event listener quando o componente é desmontado
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);*/

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.flexContainer}>
        {/*isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#00b867" size="large" />
          </View>
        )*/}
        <WebView
            ref={webViewRef}
            source={{ uri: HOME_URL }}
            startInLoadingState={false}
            scalesPageToFit={false}
            renderLoading={() => null}  // Não renderiza nada durante o carregamento
            //onMessage={onWebViewMessage}
            //onNavigationStateChange={onNavigationStateChange}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }

    const projectId = '429352ea-c8c5-454f-8f7c-ee0e2de4dc67';

    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Push token:', token);
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

async function checkForStoredToken() {
  const storedToken = await AsyncStorage.getItem('PUSH_TOKEN');
  if (storedToken) {
    console.log('Token já armazenado:', storedToken);
    return storedToken;
  } else {
    return null;
  }
}

async function sendTokenAndUserData(token, username) {
  const myHeaders = new Headers();

  const form = new FormData();
  form.append("username", username);
  form.append("token", token);

  // let api_url = "http://10.0.0.128/batch/user-token-expo";
  let api_url = "https://sala.preparaconcursos.com.br/batch/user-token-expo";
  try {
    const response = await fetch(api_url, {
      method: "POST",
      headers: myHeaders,
      body: form,
      redirect: "follow"
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error('Erro ao enviar dados para a API:', error);
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#00b867ff',
    paddingTop: 15
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  },
});

export default App;
