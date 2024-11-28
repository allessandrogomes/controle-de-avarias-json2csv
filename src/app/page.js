'use client'

import { useState } from "react";
import styles from "./page.module.scss"
import { Parser } from "json2csv";
import "normalize.css";

export default function Home() {

  const [breakdowns, setBreakdowns] = useState([])
  const [code, setCode] = useState("")
  const [desc, setDesc] = useState("")
  const [qtd, setQtd] = useState("")

  const options = {
    delimiter: {
      field: ';'
    }
  }

  const parser = new Parser(options)

  function addBreakdown(code, desc, qtd, event) {
    event.preventDefault()

    const breakdown = {
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

  return (
    <main className={styles.main}>
      <h1>Controle de Avarias</h1>

      <form className={styles.form} onSubmit={(event) => addBreakdown(code, desc, qtd, event)}>
        <div>
          <label>Código</label>
          <input type="number" onChange={(event) => setCode(event.target.value)} value={code} required />
        </div>
        <div>
          <label>Descrição</label>
          <input type="text" onChange={(event) => setDesc(event.target.value)} value={desc} required />
        </div>
        <div>
          <label>Qtd</label>
          <input type="text" onChange={(event) => setQtd(event.target.value)} value={qtd} required />
        </div>

        <button type="submit">Adicionar</button>
      </form>

      <div>
        <h2>Avarias adicionadas</h2>
        {breakdowns.length ? breakdowns.map(item => <p key={item.codigo}>{item.codigo} | {item.descricao} | {item.quantidade}</p>) : <p>Nenhuma avaria adicionada</p>}
      </div>

      <button disabled={!breakdowns.length} onClick={downloadCsv}>Baixar CSV</button>
    </main>
  );
}
