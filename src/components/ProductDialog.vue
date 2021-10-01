<template>
    <v-dialog 
    v-model="dialog" 
    width="700" 
    lighten
    persistent    
    >
        <v-card>
            <v-card-title>
                <span class="text-h5">Producto</span>
            </v-card-title>
            <v-form 
            ref="form"
            @submit.prevent="processForm"
            lazy-validation
            >
                <v-container padding >
                    <v-row>
                        <v-col class="d-flex" cols="12" sm="6">
                        <v-select
                            v-model.trim="product.roleName"
                            label="Categorias"
                            solo
                            :items="categoryNames"
                            :rules="[v => !!v || 'Item requerido']"
                            required
                        ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                        <v-text-field
                            v-model.trim="product.name"
                            label="Nombre"
                            :rules="nameRules"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" >
                        <v-text-field
                            v-model.number="product.price"
                            type="number"
                            label="Precio"
                            prefix="S/."
                            :rules="numberRules"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" >
                        <v-text-field
                            v-model.number="product.stock"
                            type="number"
                            label="Stock"
                            :rules="numberInteger"
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                        <v-switch label="Estado" v-model="product.state"></v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="reset">
                            Reset
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="toggle">
                            Cerrar
                            </v-btn>
                            <v-btn 
                            color="blue darken-1" text 
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
</template>

<script>
import { mapState } from 'vuex';
export default {
    props:{
        product: Object,
        categoryNames: Array,
        dialog: Boolean,
    },
    data() {
        return {
            nameRules: [
                v => !!v || 'Campo requerido',
                v => (v && v.length <= 200) || 'Name must be less than 20 characters',
            ],
            numberRules: [
                v => (Number.isFinite(v)) || 'tiene que ser un número',
                v => (v && v > 0 ) || 'Tiene que ser mayor que cero',
            ],
            numberInteger:[
                v => (v && v > 0 ) || 'Tiene que ser mayor que cero',
                v => (Number.isInteger(v)) || 'tiene que ser un número entero',
            ]
        }
    },
    methods:{
        async processForm(){
            if(this.$refs.form.validate()){
                await this.$emit('action')
                this.reset()
                this.toggle()
            }
            
        },
        reset(){
            this.$emit('reset')
        },
        toggle(){
            this.$emit('toggle')
        },
    }
};
</script>
