<template>
    <v-container>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Venta</span>
                </v-card-title>
                <v-form
                lazy-validation
                ref="form"
                @submit.prevent="processSale"
                >
                    <v-container>
                        <!-- ---    INPUTS   -->
                        <v-row>
                            <v-col 
                            cols="12"
                            sm="6" 
                            >
                            <v-text-field
                                label="DNI"
                                required
                                :rules="nameRules"
                                v-model.trim="client.dni"
                            ></v-text-field>
                            </v-col>
                            <v-col 
                            cols="12" 
                            sm="6"
                            >
                            <v-text-field
                                label="Nombre"
                                :rules="nameRules"
                                required
                                v-model.trim="client.name"
                            ></v-text-field>
                            </v-col>
                            <v-col 
                            cols="12" 
                            sm="6"
                            >
                            <v-text-field
                                label="Apellido"
                                :rules="nameRules"
                                required
                                v-model.trim="client.lastName"
                            ></v-text-field>
                            </v-col>
                            <v-col 
                            cols="12" 
                            sm="6"
                            >
                            <v-text-field
                                label="DNI del vendedor"
                                :rules="nameRules"
                                required
                                v-model.trim="dniEmp"
                            ></v-text-field>
                            <p v-if="!empExists"
                            class="red--text">DNI no registrado</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="reset">
                                    Reset
                                </v-btn>
                                <v-btn color="blue darken-1" text @click="toggleDialog">
                                    Close
                                </v-btn>
                                <v-btn 
                                color="blue darken-1" 
                                text 
                                type="submit">
                                    Submit
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-dialog>
        <v-row justify="center">
            <v-col cols="7" sm="4">
                <h3 class="text-primary fw-bold text-center">LISTA DE PEDIDOS</h3>
            </v-col>
        </v-row>
        <!----------- AMOUNT    -->
        <v-row justify="center">
            <v-col cols="3">
                <v-text-field
                    type="number"
                    label="Cantidad"
                    v-model.number="order.amount"
                    required
                ></v-text-field>
            </v-col>
        </v-row>
        <!----------- Table products    -->
        <v-row>
            <v-col cols="12">
                <table-products 
                :nameCategories="nameCategories" 
                :visible="false"
                :object="order"
                @select="select"
                />
            </v-col>
        </v-row>
        <!----------- Table Orders    -->
        <v-row justify="center"
        v-if="orders.length > 0"
        >
            <v-col cols="4">
                <v-btn 
                @click="toggleDialog"
                class="w-100"
                color="primary"
                >
                    Concretar venta
                </v-btn>
            </v-col>
        </v-row>
        <v-row
        v-if="orders.length > 0"
        >
            <v-col cols="12">
                <table-orders 
                @remove="remove"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { mapActions, mapMutations, mapState } from 'vuex'
import TableOrders from '../components/TableOrders.vue'
import TableProducts from '../components/TableProducts.vue'

export default {
    components: { TableProducts, TableOrders },
    data() {
        return {
            dialog: false,
            order:{
                idSal: '',
                namePro: '',
                price: 0.0,
                amount: 0,
                total: 0.0
            },
            client:{
                dni: '',
                name: '',
                lastName: ''
            },
            dniEmp: '',
            productList: [],

            nameRules: [
                v => !!v || 'Campo requerido',
                v => (v && v.length <= 200) || 'Name must be less than 20 characters',
            ],
            
        }
    },
    computed: {
        ...mapState(['proFiltered','categories','orders','sales','employees']),
        nameCategories(){
            let objects = []
            this.proFiltered.forEach(item=>{
                // looking for a category object who id is equal to the product 
                let nameCategory = '' 
                this.categories.forEach(obj=>{
                    if(obj.id === item.idCat){
                        return nameCategory = obj.name
                    }
                })
                objects.push(nameCategory)
            })
            return objects
        },
        empExists(){
            return (this.employees.find(item=> item.dni.trim() === this.dniEmp.trim()) || this.dniEmp === '')
        }
    },
    methods:{
        ...mapActions(['readProducts','createOrder','deleteOrder','updateOrder','createSale','createClient', 'updateProduct','readEmployees']),
        ...mapMutations(['UpdateProduct','setOrders']),
        select(index){
            // computing the total
            let total = this.proFiltered[index].price * this.order.amount
            // rounding   
            total = Number(total.toFixed(2))
            //  updating product
            let prod = {...this.proFiltered[index]} //      getting product
            prod.stock -= this.order.amount
            //  verifying product
            if (prod.stock === 0) prod.state = false
            this.UpdateProduct(prod)
            //  setting the results
            let Order = this.orders.find(item => item.namePro === prod.name)
            if(Order){
                Order.amount += this.order.amount
                Order.total += total
                Order.total = Number(total.toFixed(Order.total))
                this.updateOrder(Order)
            }else{
                this.productList.push(prod) // adding product to a list to update

                this.order.namePro = prod.name
                this.order.price = prod.price
                this.order.total = total
                
                this.createOrder({...this.order})
            }
            this.reset()
        },
        remove(index){
            let Order = this.orders[index]
            // data
            let {namePro, amount} = Order
            //   re-updating product
            let product = this.proFiltered.find(pro => pro.name === namePro)
            product.stock += amount
            // verifying product
            if(product.stock >= 0) product.state = true
            //  removing order
            this.deleteOrder(namePro)
        },
        async processSale(){
            if(this.$refs.form.validate() && this.empExists){

                // getting the datetime 
                const today = new Date(Date.now())
                // getting the total of orders
                let total = 0
                this.orders.forEach(order => total += order.total)
                let objSale = {
                    dniEmp: this.dniEmp,
                    dniCli: this.client.dni,
                    date: today.toLocaleDateString(),
                    total: total
                }
                //  Adding
                await this.createClient(this.client)
                await this.createSale(objSale)
                // Updating products
                let currentProducts = []
                this.productList.forEach(item=>{
                    // getting the current product list
                    let obj = this.proFiltered.find(obj=> obj.name === item.name)
                    currentProducts.push(obj)
                })
                this.productList = []
                currentProducts.forEach(async item=>{
                    await this.updateProduct(item)
                })
                this.reset()
                this.toggleDialog()
            }
        },
        toggleDialog(){
            this.dialog = !this.dialog
        },
        reset(){
            this.order = {
                idSal: '',
                namePro: '',
                price: 0.0,
                amount: 0,
                total: 0.0
            }
            this.client = {
                dni: '',
                name: '',
                lastName: ''
            }
            this.dniEmp = ''
        }
    },
    async created(){
        
        await this.readProducts()
        await this.readEmployees()
        this.setOrders([])
    }
    
}
</script>