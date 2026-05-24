import AsyncStorage from "@react-native-async-storage/async-storage";
 const PROFILE_IMAGE_KEY = "PROFILE_IMAGE";
  export const saveProfileImage = async ( uri: string ) => { await AsyncStorage.setItem( PROFILE_IMAGE_KEY, uri ); 

  }; 
  export const getProfileImage = async () => 
    { return await AsyncStorage.getItem( PROFILE_IMAGE_KEY ); };