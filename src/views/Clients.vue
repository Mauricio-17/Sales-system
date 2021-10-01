<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="7" sm="4">
                <h3 class="text-primary fw-bold text-center">LISTA DE CLIENTES</h3>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="9" sm="6">
                <v-text-field
                    label="Buscar por nombre"
                    v-model.trim="search"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row 
        v-if="loadingCli"
        justify="center">
            <v-col cols="10" sm="6">
                <loading />
            </v-col>
        </v-row>
        <v-row
        v-else>
            <v-col cols="12">
                <v-data-table
                    dense
                    :headers="headers"
                    :items="objects"
                    :items-per-page="10"
                    class="elevation-1"
                ></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
//@ts-check
import { mapActions, mapMutations, mapState } from 'vuex'
import Loading from '../components/Loading.vue'
export default {
    components:{
        Loading
    },
    data() {
        return {
            search : '',
            headers: [
                { text:'DNI', value:'dni', sortable: false, align: 'center'},
                { text:'Nombre', value:'name', align: 'center' },
                { text:'Apellido', value:'lastName', align: 'center' },
            ]
        }
    },
    computed:{
        ...mapState(['cliFiltered','loadingCli']),
        objects(){
            let obj = []
            this.cliFiltered.forEach(element => {
                obj.push(element)
            });
            return obj
        }
    },
    methods:{
        ...mapActions(['readClients']),
        ...mapMutations(['filterClients'])
    },
    watch:{
        search: function(){
            this.filterClients(this.search)
        }
    }
    

}
</script>

