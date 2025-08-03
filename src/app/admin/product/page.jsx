'use client'
import React, { useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'sonner'

const Product = () => {
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('1') // default ke pupuk

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user_id = localStorage.getItem('id_user')
    const formData = new FormData()
    formData.append('name', name)
    formData.append('photo', photo)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('user_id', user_id)
    formData.append('category_id', categoryId)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product/add-product`, formData)
      const data = res
     
      toast(data.data.message, {
        style: {
          backgroundColor: '#b9f8cf',
          color: '#009966',
          border: '#05df72',
        },
      })
    } catch (err) {
      console.error('Error:', err)
      let message = error.response.data.error
      toast(message, {
        style: {
          backgroundColor: '#ffa2a2',
          color: '#e7000b',
          border: '#460809',
        },
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-4   d-flex  gap-2 flex-column"
    >
      <div className="head-wrapper relative ">
        <div
          className="d-flex bg-yellowBackground"
          style={{
            height: '56px',
            borderRadius: '0px 0px 60px 60px',
          }}
        />
      </div>
      <div>
        <label>Nama Produk:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Foto Produk:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
      </div>

      <div>
        <label>Harga:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Stok:</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Kategori:</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="1">Pupuk</option>
          <option value="2">Obat</option>
          <option value="3">Alat Tani</option>
        </select>
      </div>

      <button type="submit">Simpan Produk</button>
    </form>
  )
}

export default Product
