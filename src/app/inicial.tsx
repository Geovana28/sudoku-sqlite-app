import { StyleSheet, View } from 'react-native';
import InicialComponente from '@/components/InicialComponente';

export default function InicialScreen() {
    return (
        <View style={styles.container}>
            <InicialComponente />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
