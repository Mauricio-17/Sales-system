//@ts-check
import Vue from 'vue'
import Vuex from 'vuex'


import { db } from '../firebase'

const productReference = db.collection('products')
const clientReference = db.collection('clients')
const categoryReference = db.collection('categories')
const employeeReference = db.collection('employees')
const orderReference = db.collection('orders')
const roleReference = db.collection('roles')
const saleReference = db.collection('sale')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    roles: [],
    employees: [],
    sales: [],
    clients: [],
    cliFiltered: [],
    products: [],
    proFiltered: [],
    orders: [],
    categories: [],
    product: null,
    role: null,
    category: null,
    order: null,

    loadingPro: false,
    loadingSal: false,
    loadingRol: false,
    loadingEmp: false,
    loadingCli: false,
    loadingOrd: false,
    loadingCat: false,

    user: null

  },
  mutations: {
    setLoading(state, payload){
      state[payload.list] = payload.value
    },

    filterProducts(state, payload){
      state.proFiltered = state.products.filter(item =>{
        let namePro = item.name.toLowerCase()
        payload = payload.toLowerCase()
        if(namePro.startsWith(payload)) return item
      })
    },
    filterClients(state, payload){
      state.cliFiltered = state.clients.filter(item =>{
        let nameCli = item.name.toLowerCase()
        payload = payload.toLowerCase()
        if(nameCli.startsWith(payload)) return item
      })
    },

    setUser(state, payload){
      state.user = payload
    },

    // ----------------------- SET ------------------
    setProduct(state, payload) {
      state.product = payload
    },
    setRole(state, payload) {
      state.role = payload
    },
    setCategory(state, payload) {
      state.category = payload
    },
    setOrder(state, payload) {
      state.order = payload
    },


    setProducts(state, payload) {
      state.products = payload
      state.proFiltered = payload
    },
    setEmployees(state, payload) {
      state.employees = payload
    },
    setSales(state, payload) {
      state.sales = payload
    },
    setClients(state, payload) {
      state.clients = payload
      state.cliFiltered = payload
    },
    setOrders(state, payload) {
      state.orders = payload
    },
    setCategories(state, payload) {
      state.categories = payload
    },
    setRoles(state, payload) {
      state.roles = payload
    },
    // -------------------------- CREATE ------------

    createRole(state, payload) {
      state.roles.push(payload)
    },
    createEmployee(state, payload) {
      state.employees.push(payload)
    },
    createSale(state, payload) {
      state.sales.push(payload)
    },
    createClient(state, payload) {
      state.clients.push(payload)
      state.cliFiltered.push(payload)
    },
    createOrder(state, payload) {
      state.orders.push(payload)
    },
    createCategory(state, payload) {
      state.categories.push(payload)
    },
    createProduct(state, payload) {
      state.products.push(payload)
      state.proFiltered.push(payload)
    },
    // -------------------------- UPDATE ----------------

    updateOrder(state, payload) {
      state.orders = state.orders.map(item => (
        item.namePro === payload.namePro ? payload : item
      ))
    },
    updateCategory(state, payload) {
      state.categories = state.categories.map(item => (
        item.id === payload.id ? payload : item
      ))
    },
    UpdateProduct(state, payload) {
      state.products = state.products.map(item => (
        item.id === payload.id ? payload : item
      ))
      state.proFiltered = state.proFiltered.map(item => (
        item.id === payload.id ? payload : item
      ))
    },
    updateRole(state, payload) {
      state.roles = state.roles.map(item => (
        item.id === payload.id ? payload : item
      ))
    },
    // -------------------------- DELETE -----------------
    deleteRole(state, payload) {
      state.roles = state.roles.filter(item => item.id !== payload)
    },
    deleteEmployee(state, payload) {
      state.employees = state.employees.filter(item => item.id !== payload)
    },
    deleteProduct(state, payload) {
      state.products = state.products.filter(item => item.id !== payload)
      state.proFiltered = state.proFiltered.filter(item => item.id !== payload)
    },
    deleteOrder(state, payload) {
      state.orders = state.orders.filter(item => item.namePro !== payload)
    },
    deleteCategory(state, payload) {
      state.categories = state.categories.filter(item => item.id !== payload)
    }
  },
  actions: {

    // ------------------- CREATE -------------------

    async createProduct({ commit }, item) {
      try {
        const res = await productReference.add(item)
        console.log(res.id)
        item.id = res.id
        commit('createProduct', item)
      } catch (error) {
        console.log(error)
      }
    },
    async createRole({ commit }, item) {
      try {
        const res = await roleReference.add(item)
        console.log(res)
        item.id = res.id
        commit('createRole', item)
      } catch (error) {
        console.log(error)
      }
    },
    async createEmployee({ commit }, item) {
      try {
        const res = await employeeReference.add(item)
        console.log(res)
        item.id = res.id
        commit('createEmployee', item)
      } catch (error) {
        console.log(error)
      }
    },
    async createClient({ commit }, item) {
      try {
        const res = await clientReference.add(item)
        console.log(res)
        commit('createClient', item)
      } catch (error) {
        console.log(error)
      }
    },
    async createCategory({ commit }, item) {
      try {
        const res = await categoryReference.add(item)
        console.log(res)
        item.id = res.id
        commit('createCategory', item)
      } catch (error) {
        console.log(error)
      }
    },
    async createSale({ commit, state }, item) {
      try {
        const res = await saleReference.add(item)
        console.log(res)
        // adding a list of orders
        state.orders.forEach(async order => {
          order.idSal = res.id
          await orderReference.add(order)
        })
        item.id = res.id
        commit('createSale', item)
        commit('setOrders', [])
      } catch (error) {
        console.log(error)
      }
    },
    createOrder({ commit }, item) {
      commit('createOrder', item)
    },

    // ---------------------- READ -----------------------
    
    setProduct({ commit }, item) {
      commit('setProduct', item)
    },
    setRole({ commit }, item) {
      commit('setRole', item)
    },

    async readProducts({ commit }) {
      try {
        commit('setLoading', {list: 'loadingPro', value: true})
        const res = await productReference.get()
        const items = []
        const data = res.forEach(doc => {
          let item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        console.log(data)
        commit('setProducts', items)
      } catch (error) {
        console.log(error)
      } finally{
        commit('setLoading', {list: 'loadingPro', value: false})
      }
    },
    async readRoles({ commit, state }) {
      try {
        commit('setLoading', {list: 'loadingRol', value: true})
        const res = await roleReference.get()
        const items = []
        res.forEach(doc => {
          let item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        console.log(items)
        commit('setRoles', items)
      } catch (error) {
        console.log(error)
      } finally{
        commit('setLoading', {list: 'loadingRol', value: false})
      }
    },
    async readEmployees({ commit }) {
      try {
        commit('setLoading', {list: 'loadingEmp', value: true})
        const res = await employeeReference.get()
        const items = []
        const data = res.forEach(doc => {
          let item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        console.log(data)
        commit('setEmployees', items)
      } catch (error) {
        console.log(error)
      } finally{
        commit('setLoading', {list: 'loadingEmp', value: false})
      }
    },
    async readClients({ commit }) {
      try {
        commit('setLoading', {list: 'loadingCli', value: true})
        const res = await clientReference.get()
        const items = []
        const data = res.forEach(doc => {
          let item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        console.log(data)
        commit('setClients', items)
      } catch (error) {
        console.log(error)
      } finally{
        commit('setLoading', {list: 'loadingCli', value: false})
      }
    },
    async readCategories({ commit }) {
      try {
        commit('setLoading', {list: 'loadingCat', value: true})
        const res = await categoryReference.get()
        const items = []
        const data = res.forEach(doc => {
          let item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        console.log(data)
        commit('setCategories', items)
      } catch (error) {
        console.log(error)
      } finally{
        commit('setLoading', {list: 'loadingCat', value: false})
      }
    },
    async readSales({ commit }) {
      try {
        commit('setLoading', {list: 'loadingSal', value: true})
        const res = await saleReference.get()
        const items = []
        const data = res.forEach(doc => {
          let item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        console.log(data)
        commit('setSales', items)
      } catch (error) {
        console.log(error)
      } finally{
        commit('setLoading', {list: 'loadingSal', value: false})
      }
    },
    async readOrders({ commit }) {
      try {
        commit('setLoading', {list: 'loadingOrd', value: true})
        const res = await orderReference.get()
        const items = []
        const data = res.forEach(doc => {
          let item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        console.log(data)
        commit('setOrders', items)
      } catch (error) {
        console.log(error)
      } finally{
        commit('setLoading', {list: 'loadingOrd', value: false})
      }
    },

    // ----------------- UPDATE -----------------

    async updateRole({ commit }, item) {
      try {
            await roleReference.doc(item.id).update({
                name: item.name,
                description: item.description,
                state: item.state
            })
        console.log('updated')
        commit('updateRole', item)
      } catch (error) {
        console.log(error)
      }
    },
    async updateCategory({ commit }, item) {
      try {
        await categoryReference.doc(item.id).update({
          name: item.name,
          description: item.description,
          state: item.state
        })
        console.log('updated')
        commit('updateCategory', item)
      } catch (error) {
        console.log(error)
      }
    },
    async updateProduct({ commit }, item) {
      try {
        await productReference.doc(item.id).update({
          idCat: item.idCat,
          name: item.name,
          price: item.price,
          state: item.state,
          stock: item.stock,
          
        })
        console.log('updated')
        commit('UpdateProduct', item)
      } catch (error) {
        console.log(error)
      }
    },
    updateOrder({ commit }, item) {
      commit('updateOrder', item)
    },

    // ------------------- DELETE -------------------

    async deleteRole({ commit }, id) {
      try {
        await roleReference.doc(id).delete()
        console.log(' deleted')
        commit('deleteRole', id)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteEmployee({ commit }, id) {
      try {
        const res = await employeeReference.doc(id).delete()
        console.log(res + ' deleted')
        commit('deleteEmployee', id)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteCategory({ commit }, id) {
      try {
        const res = await categoryReference.doc(id).delete()
        console.log(res + ' deleted')
        commit('deleteCategory', id)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteProduct({ commit }, id) {
      try {
        const res = await productReference.doc(id).delete()
        console.log(res + ' deleted')
        commit('deleteProduct', id)
      } catch (error) {
        console.log(error)
      }
    },
    deleteOrder({ commit }, id) {
      commit('deleteOrder', id)
    },

  },
  getters:{

  },
  modules: {
  }
})
