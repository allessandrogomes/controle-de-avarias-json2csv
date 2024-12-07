import styles from "./styles.module.scss"

export default function ModalConfirmDelete({ code, desc, qtd, cancelBtn, confirmBtn }) {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Tem certeza que deseja excluir o item <span>{code} | {desc} | {qtd}</span>?</h2>
                <div className={styles.modalActions}>
                    <button onClick={cancelBtn}>Cancelar</button>
                    <button onClick={confirmBtn} className={styles.btnDanger}>Excluir</button>
                </div>
            </div>
        </div>
    )
}