<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="8" sm="5">
                <h3 class="text-primary fw-bold text-center">LISTA DE EMPLEADOS</h3>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="4" md="3" lg="2">
                <v-btn 
                @click="dialog = true"
                class="w-100"
                color="primary">
                    Agregar
                </v-btn>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-dialog 
            v-model="dialog" 
            persistent
            width="700"
            lighten
            >
            <v-card>
                <v-card-title>
                    <span class="text-h5">Empleado</span>
                </v-card-title>
                <v-form
                @submit.prevent="addEmployee"
                ref="form"
                lazy-validation
                >
                    <v-container>
                        <v-row>
                            <v-col
                                class="d-flex"
                                cols="12"
                                sm="6"
                            >
                                <v-select
                                label="Categorias"
                                solo
                                :rules="[v => !!v || 'Item requerido']"
                                :items="roleNames"
                                v-model="name"
                                required
                                ></v-select>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                            >
                                <v-text-field
                                label="DNI"
                                v-model.trim="employee.dni"
                                :rules="nameRules"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                            >
                                <v-text-field
                                label="Nombre"
                                v-model.trim="employee.name"
                                :rules="nameRules"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col 
                            cols="12"
                            sm="6"
                            >
                                <v-text-field
                                label="Apellido"
                                :rules="nameRules"
                                v-model.trim="employee.lastName"
                                required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="reset"
                                >
                                    Reset
                                </v-btn>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="dialog = false"
                                >
                                    Cerrar
                                </v-btn>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    type="submit"
                                >
                                    Submit
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
            </v-dialog>
        </v-row>
        <v-row 
        v-if="loadingEmp"
        justify="center">
            <v-col cols="10" sm="6">
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
                                    ROL
                                </th>
                                <th class="text-left">
                                    DNI
                                </th>
                                <th class="text-left">
                                    NOMBRE
                                </th>
                                <th class="text-left">
                                    APELLIDO
                                </th>
                                <th class="text-left">
                                    OPCIÓN
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(item, index) in employees"
                            :key="index"
                            >
                                <td>{{ nameRoles[index] }}</td>
                                <td>{{ item.dni }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.lastName }}</td>
                                <td>
                                    <v-btn
                                    @click="openValidate"
                                    color="error">
                                        <delete-validate 
                                        :dialog="dialogValidate"
                                        :id="item.id"
                                        @close="closeValidate"
                                        @remove="removeEmployee"
                                        />
                                        <v-icon >
                                            {{ icons.mdiDelete }}
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
import { mapActions, mapState } from 'vuex'
import {
    mdiPencil,
    mdiDelete,
  } from '@mdi/js'
import DeleteValidate from '../components/DeleteValidate.vue'
import Loading from '../components/Loading.vue'
export default {
    components:{
        DeleteValidate, Loading
    },
    data() {
        return {
            icons: {
                mdiPencil,
                mdiDelete,
            },

            dialog: false,
            dialogValidate: false,
            employee:{
                idRol: '', 
                dni: '', 
                name: '', 
                lastName: '',
            },

            IDs:[],
            roleNames: [],
            name: '',

            nameRules: [
                v => !!v || 'Campo requerido',
                v => (v && v.length <= 20) || 'Name must be less than 20 characters',
            ],
            numberRules: [
                v => (Number.isFinite(v)) || 'tiene que ser un número',
                v => (v && v > 0 ) || 'Tiene que ser mayor que cero',
            ]
        }
    },
    methods:{
        ...mapActions(['createEmployee','readEmployees','deleteEmployee']),
        async addEmployee(){

            if(this.$refs.form.validate()){
                
                let index = this.roleNames.indexOf(this.name)
                if(index >= 0){
                    this.employee.idRol = this.IDs[index]
                    this.employee.name = this.employee.name.toUpperCase()
                    this.employee.lastName = this.employee.lastName.toUpperCase()

                    await this.createEmployee(this.employee)
                    this.reset()
                    this.dialog = false
                }
            }
        },
        async removeEmployee(id){
            await this.deleteEmployee(id),
            this.closeValidate()
        },
        openValidate(){
            this.dialogValidate=true
        },
        closeValidate(){
            this.dialogValidate = false
        },
        reset(){
            this.employee = {
                idRol: '',
                dni: '',
                name: '', 
                lastName: '',
            }
        }
    },
    computed:{
        ...mapState(['employees','roles','loadingEmp']),
        nameRoles(){
            let objects = []
            this.roles.forEach(item =>{
                if(item.state){
                    this.roleNames.push(item.name)
                    this.IDs.push(item.id)
                }
            })
            this.employees.forEach(item=>{
                // looking for a category object who id is equal to the product 
                let nameRole = '' 
                this.roles.forEach(obj=>{
                    if(obj.id === item.idRol)
                        return nameRole = obj.name
                })
                objects.push(nameRole)
            })
            return objects
        }
    },
    mounted(){
        this.nameRoles
    },
    async created(){
        await this.readEmployees()
    }
}
</script>

<style>

</style>