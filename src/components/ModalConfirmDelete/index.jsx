import styles from "./styles.module.scss"

export default function ModalConfirmDelete({ actionText, cancelBtn, confirmBtn }) {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2 dangerouslySetInnerHTML={{ __html: actionText }}></h2>
                <div className={styles.modalActions}>
                    <button onClick={cancelBtn}>Cancelar</button>
                    <button onClick={confirmBtn} className={styles.btnDanger}>Excluir</button>
                </div>
            </div>
        </div>
    )
}