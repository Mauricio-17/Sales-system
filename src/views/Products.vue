<template>
    <v-container>

        <v-row justify="center">
            <v-col cols="8" sm="5" lg="4">
                <h3 class="text-primary fw-bold text-center">LISTA DE PRODUCTOS</h3>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="4" md="3" lg="2">
                <v-btn 
                @click="add"
                class="w-100"
                color="primary"
                >
                    Agregar
                </v-btn>
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
        v-if="loadingPro"
        justify="center">
            <v-col cols="10" sm="5">
                <Loading />
            </v-col>
        </v-row>
        <v-row justify="center">
            <product-dialog 
            :product="product" 
            @action="Action" 
            @toggle="toggleDialog"
            @reset="reset" 
            :categoryNames="categoryNames" 
            :dialog="dialog"
            />
        </v-row>
        <v-row v-if="!loadingPro">
            <v-col cols="12">
                <table-products @action="setProduct" :nameCategories="nameCategories"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
//@ts-check
import { mapState, mapActions, mapMutations } from 'vuex';
import ProductDialog from '../components/ProductDialog.vue';
import TableProducts from '../components/TableProducts.vue';
import Loading from '../components/Loading.vue';
export default {
    components: {ProductDialog, TableProducts, Loading},
    data: () =>{
        return {
            search: '',
            product:{
                idCat: '',
                roleName:'',
                name:'',
                stock: 0,
                price: 0.0,
                state: false
            },
            IDs:[],
            categoryNames: [],
            dialog: false,
            process: false
        };
    },
    methods:{
        ...mapActions(['readProducts','createProduct','deleteProduct','updateProduct']),
        ...mapMutations(['filterProducts']),
        async Action(){
            this.addDeleteCategory(this.product)
            if(this.process){
                await this.updateProduct(this.product)
            }else{
                await this.createProduct(this.product)
            }
        },
        addDeleteCategory(obj){
            let index = this.categoryNames.indexOf(obj.roleName)
            if(index >= 0){
                obj.idCat = this.IDs[index]
                obj.name = obj.name.toUpperCase()
                console.log(obj.name)
                delete obj.roleName
            }
        },
        setProduct(item){
            let index = this.IDs.indexOf(item.idCat)
            item.roleName = this.categoryNames[index]
            this.product = {...item}
            this.process = true
            this.toggleDialog()
        },
        add(){
            this.reset()
            this.process = false
            this.toggleDialog()
        },
        toggleDialog(){
            this.dialog = !this.dialog
        },
        reset(){
            this.product = {
                idCat: '',
                roleName:'',
                name:'',
                stock: 0,
                price: 0.0,
                state: false
            }
        },
    },
    computed:{
        ...mapState(['proFiltered','categories','loadingPro']),
        nameCategories(){
            let objects = []
            this.IDs = []
            this.categoryNames = []
            this.categories.forEach(obj=>{
                if(obj.state){
                    this.IDs.push(obj.id)
                    this.categoryNames.push(obj.name)
                }
            })
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
        
    },
    watch:{
        search: function(){
            this.filterProducts(this.search)
        }
    },
    mounted(){  
        this.nameCategories
    },
    async created(){
        await this.readProducts()
    }
};
</script>
