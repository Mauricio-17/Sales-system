<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="7" sm="4">
                <h3 class="text-primary fw-bold text-center">LISTA DE ROLES</h3>
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
            <role-dialog 
            :role="role"
            :dialog="dialog"
            @action="Action"
            @reset="reset"
            @toggle="toggleDialog"
            />
        </v-row>
        <v-row 
        v-if="loadingRol"
        justify="center">
            <v-col cols="10" sm="6">
                <loading />
            </v-col>
        </v-row>
        <v-row v-else>
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
                            v-for="(item, index) in roles"
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
                                        @remove="removeRole"
                                        />  
                                        <v-icon >
                                            {{ icons.mdiDelete }}
                                        </v-icon>
                                    </v-btn>
                                    <v-btn
                                    @click="setRole(item)"
                                    color="warning"
                                    >
                                        <v-icon>
                                            {{ icons.mdiPencil }}
                                        </v-icon>
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
import { mapActions, mapState } from 'vuex'
import RoleDialog from '../components/RoleDialog.vue'
import {
    mdiPencil,
    mdiDelete,
  } from '@mdi/js'
import DeleteValidate from '../components/DeleteValidate.vue'
import Loading from '../components/Loading.vue'

export default {
    components: {   RoleDialog, DeleteValidate, Loading  },
    data: ()=> {
        return {
            icons: {
                mdiPencil,
                mdiDelete,
            },

            role:{
                id: '',
                name:'',
                description:'',
                state: false
            },
            dialog: false,
            dialogValidate: false,
            processAction: false,

        }
    },
    methods:{
        ...mapActions(['createRole','updateRole','deleteRole']),
        async addRole(){
            this.role.name = this.role.name.toUpperCase();
            await this.createRole(this.role)
        },
        async UpdateRole(){
            this.role.name = this.role.name.toUpperCase();
            await this.updateRole(this.role)
        },
        async Action(){
            if(this.processAction){
                await this.UpdateRole()
            }else{
                await this.addRole()
            }
        },
        async removeRole(id){
            await this.deleteRole(id)
            this.closeValidate()
        },
        openValidate(){
            this.dialogValidate = true
        },
        closeValidate(){
            this.dialogValidate = false
        },
        add(){
            this.reset()
            this.processAction = false
            this.toggleDialog()
        },
        setRole(item){
            this.processAction = true
            this.role = {...item}
            this.toggleDialog()
        },
        reset(){
            this.role = {
                id:'',
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
        ...mapState(['roles','loadingRol']),
        objects(){
            let objects = []
            this.roles.forEach(item=>{
                objects.push({
                    name: item.name,
                    description: item.description,
                    state: (item.state ? 'Habilitado' : 'Inhabilitado')
                })
            })
            return objects
        }
    }
    
}
</script>

<style>

</style>