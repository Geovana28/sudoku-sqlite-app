import { StyleSheet, View } from 'react-native';
import LoginComponente from '@/components/LoginComponente';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <LoginComponente />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7f6',
    },
});
