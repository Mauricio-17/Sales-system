<template>
  <v-app>
    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      color="blue lighten-3"
    >
      <v-list
        nav
        dense
      >
        <!--
        <template>
          <v-list-item :to="{ name: 'Home' }">
            <v-list-item-action>
              <v-icon>fas fa-home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
        </template>   
        --->

        <template>
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-title>
                  Producto
              </v-list-item-title>
            </v-list-item>
            <v-list-item :to="{name: 'Categories'}">
              <v-list-item-action>
                <v-icon small>fas fa-folder</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Categorias
              </v-list-item-title>
            </v-list-item>
            <v-list-item :to="{name: 'Products'}">
              <v-list-item-action>
                <v-icon small>fas fa-folder</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Productos
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>

        <template>
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-title>
                  Empleado
              </v-list-item-title>
            </v-list-item>
            <v-list-item :to="{name: 'Roles'}">
              <v-list-item-action>
                <v-icon small>fas fa-folder</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Roles
              </v-list-item-title>
            </v-list-item>
            <v-list-item :to="{name: 'Employees'}">
              <v-list-item-action>
                <v-icon small>fas fa-folder</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Empleados
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>

        <template>
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-title>
                  Venta
              </v-list-item-title>
            </v-list-item>
            <v-list-item :to="{name: 'Clients'}">
              <v-list-item-action>
                <v-icon small>fas fa-folder</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Clientes
              </v-list-item-title>
            </v-list-item>
            <v-list-item :to="{name: 'Orders'}">
              <v-list-item-action>
                <v-icon small>fas fa-folder</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Pedidos
              </v-list-item-title>
            </v-list-item>
            <v-list-item :to="{name: 'Sales'}">
              <v-list-item-action>
                <v-icon small>fas fa-folder</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Ventas
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
        
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
      <!---- LogOut VALIDATION----->
      <v-dialog
      v-model="dialog"
      persistent
      max-width="275"
      > 
        <v-card>
            <v-container>
                <v-row justify="center">
                    <v-col>
                        <h1>
                            <span class="mr-2 text-primary">¿Desea cerrar sesión?</span>
                        </h1>
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="4">
                        <v-btn
                        color="warning"
                        @click="dialog = false"
                        >
                            NO
                        </v-btn>
                    </v-col>
                    <v-col cols="4">
                        <v-btn 
                        color="primary"
                        @click="logOut"
                        >
                            SI
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
      </v-dialog>
      <v-btn
        v-if="user"
        @click="dialog = true"
        text
      >
        <span class="mr-2">Cerrar Sesión</span>
      </v-btn>

      <!-------- button bar desplegable---->
      <v-app-bar-nav-icon 
      v-if="user"
      @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import router from './router/index'
export default {
  name: 'App',

  data: () => ({
    dialog: false,
    drawer: false,
    group: null,
  }),
  computed:{
    ...mapState(['user'])
  },
  methods:{
    ...mapActions(['readRoles','readCategories','readClients','readProducts']),
    ...mapMutations(['setUser']),
    logOut: function(){
      this.setUser(null)
      router.push('/login')
      this.dialog= false
      this.drawer = false
    }
  },
  async created(){
    await this.readRoles()
    await this.readCategories()
    await this.readClients()
    await this.readProducts()
  },
  watch: {
    group () {
      this.drawer = false
    },
  },

};
</script>
