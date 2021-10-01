<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="7" sm="4">
                <h3 class="text-primary fw-bold text-center">LISTA DE VENTAS</h3>
            </v-col>
        </v-row>
        <v-row 
        v-if="loadingSal"
        justify="center">
            <v-col cols="9" sm="6" md="5">
                <loading />
            </v-col>
        </v-row>
        <v-row
        v-else>
            <v-col cols="12">
                <v-simple-table
                fixed-header
                height="300px"
                dense
                >
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    DNI Vendedor
                                </th>
                                <th class="text-left">
                                    DNI Cliente
                                </th>
                                <th class="text-left">
                                    FECHA
                                </th>
                                <th class="text-left">
                                    MONTO ( S/. )
                                </th>
                                <th class="text-left">
                                    OPCION
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(item, index) in sales"
                            :key="index"
                            >
                                <td>{{ item.dniEmp }}</td>
                                <td>{{ item.dniCli }}</td>
                                <td>{{ item.date }}</td>
                                <td>
                                    {{ item.total }}
                                </td>
                                <td>
                                    <v-btn
                                    @click="show(item.id)"
                                    color="primary"
                                    >
                                        <v-icon>far fa-eye</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-row
        v-if="showOrders"
        >
            <v-col>
                <v-btn 
                @click="toggleShow"
                color="primary"
                >
                    OCULTAR
                </v-btn>
            </v-col>
            <v-col cols="12">
                <v-data-table
                    :headers="headers"
                    :items="items"
                    :items-per-page="10"
                    class="elevation-1"
                ></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
//@ts-check
import { mapActions, mapState } from 'vuex'
import Loading from '../components/Loading.vue'

export default {
    components:{
        Loading
    },
    data() {
        return {
            showOrders: false,
            headers: [
                {text:'PRODUCTO', value:'namePro', align: 'center'},
                {text:'CANTIDAD', value:'amount', align: 'center'},
                {text:'PRECIO', value:'price', align: 'center'},
                {text:'MONTO', value:'total', align: 'center'}
            ],
            items: []
        }
    },
    computed:{
        ...mapState(['sales','orders','loadingSal'])
    },
    methods:{
        ...mapActions(['readSales','readOrders']),
        show(id){
            this.items = []
            this.orders.forEach(item=>{
                if(item.idSal === id) this.items.push(item)
            })
            this.showOrders = true
        },
        toggleShow(){
            this.showOrders = !this.showOrders
        }
    },
    async created(){
        await this.readSales()
        await this.readOrders()
    }
}
</script>
