'use client'

import { useState } from "react"
import styles from "./page.module.scss"
import { Parser } from "@json2csv/plainjs"
import "normalize.css"
import Image from "next/image"
import { IoMdDownload } from "react-icons/io"
import { v4 as uuidv4 } from 'uuid'
import InputField from "@/components/InputField"
import BreakdownBox from "@/components/BreakdownBox"
import ModalConfirmDelete from "@/components/ModalConfirmDelete"

export default function Home() {

  const [breakdowns, setBreakdowns] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [code, setCode] = useState("")
  const [desc, setDesc] = useState("")
  const [qtd, setQtd] = useState("")
  const [selectedItem, setSelectedItem] = useState()
  const opts = { delimiter: ";" }
  const parser = new Parser(opts)

  function addBreakdown(code, desc, qtd, event) {
    event.preventDefault()

    const breakdown = {
      id: uuidv4(),
      codigo: code,
      descricao: desc.toUpperCase(),
      quantidade: qtd.toUpperCase()
    }

    setBreakdowns(prevState => [...prevState, breakdown])
    setCode("")
    setDesc("")
    setQtd("")
  }

  function downloadCsv() {
    try {
      const csv = parser.parse(breakdowns)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', "avarias.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Erro ao gerar CSV', err)
    }
  }

  function deleteModalAsk(item) {
    setSelectedItem(item)
    setOpenModal(true)
  }

  function removeBreakdown(id) {
    const filteredBreakdowns = breakdowns.filter(item => item.id !== id)
    setBreakdowns(filteredBreakdowns)
    setOpenModal(false)
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.logo}>
          <Image
            src="/lutiner.png"
            width={800}
            height={341}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="Logomarca da empresa Lutiner"
          />
        </div>

        <h1>Controle de Avarias</h1>

        <form className={styles.form} onSubmit={(event) => addBreakdown(code, desc, qtd, event)}>
          <InputField fieldName="Código" fieldType="number" onChange={(event) => setCode(event.target.value)} fieldValue={code} />
          <InputField fieldName="Descrição" fieldType="text" onChange={(event) => setDesc(event.target.value)} fieldValue={desc} />
          <InputField fieldName="Quantidade" fieldType="text" onChange={(event) => setQtd(event.target.value)} fieldValue={qtd} />

          <button type="submit">Adicionar</button>
        </form>

        <div className={styles.breakdowns}>
          <h2>Avarias adicionadas</h2>

          <div className={styles.breakdownsItems}>
            {breakdowns.length ?
              breakdowns.map(item => (
                <BreakdownBox
                  onCloseModal={() => deleteModalAsk(item)}
                  code={item.codigo}
                  desc={item.descricao}
                  qtd={item.quantidade}
                  key={item.id}
                />
              )) :
              <p>Nenhuma avaria adicionada</p>
            }
          </div>

          <button className={styles.downloadCsv} disabled={!breakdowns.length} onClick={downloadCsv}>Baixar CSV <IoMdDownload style={{ position: "relative", top: "3px" }} /></button>
        </div>

        {/* Modal de confirmação será exibida ao solicitar para excluir um item. */}
        {openModal ?
          <ModalConfirmDelete
            code={selectedItem.codigo}
            desc={selectedItem.descricao}
            qtd={selectedItem.quantidade}
            cancelBtn={() => setOpenModal(false)}
            confirmBtn={() => removeBreakdown(selectedItem.id)}
          /> :
          ""
        }
      </main>
      
      <footer className={styles.credits}>Desenvolvido por <a href="https://github.com/allessandrogomes" target="_blank">Alessandro Gomes</a></footer>
    </>
  );
}
