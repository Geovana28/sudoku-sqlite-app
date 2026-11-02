import { StyleSheet, View } from 'react-native';
import TelaGanhouComponente from '@/components/TelaGanhouComponente';

export default function TelaFinalGanhouScreen() {
    return (
        <View style={styles.container}>
            <TelaGanhouComponente />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
