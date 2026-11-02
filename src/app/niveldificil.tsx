import { StyleSheet, View } from 'react-native';
import SudokuTabuleiroComponente from '@/components/SudokuTabuleiroComponente';

export default function NivelDificilScreen() {
    return (
        <View style={styles.container}>
            <SudokuTabuleiroComponente nivel="Difícil" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
