<template>
    <v-dialog v-model="dialog" persistent max-width="500px">
        
        <v-card>
            <v-card-title>
                <span class="text-h5">Categorias</span>
            </v-card-title>
            <v-form
                ref="form"
                lazy-validation
                @submit.prevent="processForm"
                >
                    <v-container>
                <!-- ---    INPUTS   -->
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                label="Nombre"
                                :rules="nameRules"
                                required
                                v-model.trim="category.name"
                            ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                            <v-textarea
                                solo
                                :rules="nameRules"
                                name="input-7-4"
                                label="Descripción"
                                required
                                :rows="3"
                                v-model.trim="category.description"
                            ></v-textarea>
                            </v-col>
                            <v-col>
                            <v-switch label="Estado" v-model="category.state"></v-switch>
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
                                <v-btn color="blue darken-1" text type="submit">
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
export default {
    props:{
        category: Object,
        dialog: Boolean
    },
    data() {
        return {
            nameRules: [
                v => !!v || 'Campo requerido',
                v => (v && v.length <= 70) || 'Name must be less than 20 characters',
            ],
        }
    },
    methods:{
        async processForm(){
            if(this.$refs.form.validate()){
                await this.$emit('action')
                this.reset()
                this.toggleDialog()
            }
        },
        reset(){
            this.$emit('reset')
        },
        toggleDialog(){
            this.$emit('toggle')
        }
        
    },
    computed:{

    }
};
</script>

<style></style>
