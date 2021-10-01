<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="8" sm="5">
                <h3 class="text-primary fw-bold text-center">LISTA DE CATEGORIAS</h3>
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
            <category-dialog 
            :category="category" 
            @action="Action"
            @reset="reset"
            :dialog="dialog"
            @toggle="toggleDialog"
            />
        </v-row>
        <v-row 
        v-if="loadingCat"
        justify="center">
            <v-col cols="10" sm="6">
                <Loading />
            </v-col>
        </v-row>
        <v-row
        v-else>
            <v-col 
            cols="12" 
            >
                <v-simple-table
                fixed-header
                height="300px"
                dense
                >
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    NOMBRE
                                </th>
                                <th class="text-left">
                                    DESCRIPCIÓN
                                </th>
                                <th class="text-left">
                                    ESTADO
                                </th>
                                <th class="text-left">
                                    OPCIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(item, index) in categories"
                            :key="index"
                            >
                                <td>{{ item.name }}</td>
                                <td>{{ item.description }}</td>
                                <td>
                                    {{ item.state ? 'Habilitado' : 'Inhabilitado'}}
                                </td>
                                <td>
                                    <v-btn
                                    @click="openValidate"
                                    color="error"
                                    >
                                        <delete-validate 
                                        :id="item.id"
                                        :dialog="dialogValidate"
                                        @close="closeValidate"
                                        @remove="removeCategory"
                                        />
                                        <v-icon >
                                            {{ icons.mdiDelete }}
                                        </v-icon>
                                    </v-btn>
                                    <v-btn
                                    @click="setCategory(item)"
                                    color="warning"
                                    >
                                        <v-icon>{{ icons.mdiPencil }}</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
//@ts-check
import { mapActions, mapState } from 'vuex';
import CategoryDialog from '../components/CategoryDialog.vue';
import {
    mdiAccount,
    mdiPencil,
    mdiShareVariant,
    mdiDelete,
  } from '@mdi/js'
import DeleteValidate from '../components/DeleteValidate.vue';
import Loading from '../components/Loading.vue';

export default {
    components: {CategoryDialog, DeleteValidate, Loading},
    data: () => ({
        icons: {
            mdiAccount,
            mdiPencil,
            mdiShareVariant,
            mdiDelete,
        },

        dialogValidate : false,
        dialog: false,
        category:{
            id:'',
            name:'',
            description:'',
            state: false
        },
        processAction: false

    }),
    methods:{
        ...mapActions(['createCategory','deleteCategory','updateCategory']),
        async addCategory(){
            this.category.name = this.category.name.toUpperCase()
            await this.createCategory(this.category);
        },
        async UpdateCategory(){
            this.category.name = this.category.name.toUpperCase()
            await this.updateCategory(this.category)
        },
        async Action(){
            if(this.processAction){
                await this.UpdateCategory()
            }else{
                await this.addCategory()
            }
        },
        add(){
            this.reset()
            this.processAction = false
            this.toggleDialog()
        },
        setCategory(item){
            this.processAction = true
            this.category = {...item}
            this.toggleDialog()
        },
        async removeCategory(id){
            await this.deleteCategory(id)
            this.closeValidate()
        },
        openValidate(){
            this.dialogValidate = true
        },
        closeValidate(){
            this.dialogValidate = false
        },
        reset(){
            this.category = {
                id: '',
                name:'',
                description:'',
                state: false
            }
        },
        toggleDialog(){
            this.dialog = !this.dialog
        }
    },
    computed:{
        ...mapState(['categories','loadingCat']),
        objects(){
            let objects = []
            this.categories.forEach(item=>{
                objects.push({
                    name: item.name,
                    description: item.description,
                    state: (item.state ? 'Habilitado' : 'Inhabilitado')
                })
            })
            return objects
        }
    }
};
</script>
