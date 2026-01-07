import { useState, useEffect } from 'react'

export default function Home() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const API_URL = 'http://localhost:4000/api'

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      const res = await fetch(`${API_URL}/items`)
      const data = await res.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  async function addItem(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingId) {
        // Update existing item
        await fetch(`${API_URL}/items/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description }),
        })
        setEditingId(null)
      } else {
        // Create new item
        await fetch(`${API_URL}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description }),
        })
      }
      setName('')
      setDescription('')
      fetchItems()
    } catch (error) {
      console.error('Error saving item:', error)
    }
    setLoading(false)
  }

  function editItem(item) {
    setEditingId(item.id)
    setName(item.name)
    setDescription(item.description)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setName('')
    setDescription('')
  }

  async function deleteItem(id) {
    try {
      await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' })
      fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>シンプルなフルスタックアプリ</h1>
      <p>Next.js + Express + MySQL</p>

      <form onSubmit={addItem} style={{ marginBottom: '30px' }}>
        <h2>{editingId ? 'アイテムを編集' : 'アイテムを追加'}</h2>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="アイテム名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '10px', width: '100%', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '10px', width: '100%', fontSize: '16px', minHeight: '80px' }}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: editingId ? '#28a745' : '#0070f3',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            {loading ? '処理中...' : editingId ? '更新' : '追加'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              キャンセル
            </button>
          )}
        </div>
      </form>

      <h2>アイテムリスト ({items.length})</h2>
      {items.length === 0 ? (
        <p>まだアイテムがありません。上から追加してください！</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px',
                background: editingId === item.id ? '#fff3cd' : 'white',
              }}
            >
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <small>
                作成日時: {new Date(item.created_at).toLocaleString('ja-JP')}
              </small>
              <br />
              <button
                onClick={() => editItem(item)}
                style={{
                  marginTop: '10px',
                  marginRight: '10px',
                  padding: '5px 15px',
                  background: '#ffc107',
                  color: 'black',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '3px',
                }}
              >
                編集
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  marginTop: '10px',
                  padding: '5px 15px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '3px',
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
