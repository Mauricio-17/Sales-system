<template>
    <v-container
    >   
        <v-row justify="center">
            <v-col cols="8" sm="6" md="4" lg="3">
                <h3 class=" text-primary text-center">INICIO DE SESIÓN</h3>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" sm="9" md="6"  lg="4">
                <v-text-field
                    v-model.trim="User.userName"
                    color="blue darken-2"
                    label="User"
                    required
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" sm="9" md="6" lg="4">
                <v-text-field
                    v-model.trim="User.password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    @click:append="show1 = !show1"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="5" sm="4" md="2">
                <v-btn 
                color="primary"
                class="w-100"
                @click="login"
                >
                    Ingresar
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
//@ts-check
import { mapMutations, mapState } from 'vuex'
import router from '../router/index'
export default {
    data: () =>{
        return {
            show1: false,
            User:{
                userName:'username',
                password:'12345678',
            }
        }
    },
    computed:{
        ...mapState(['user'])
    },
    methods:{
        ...mapMutations(['setUser']),
        login(){
            let username = 'username'
            let pass = '12345678'
            let {userName, password} = this.User
            if (userName === username && password === pass){
                this.setUser(this.User)
                router.push('/products')
            }
        }
    }
}
</script>