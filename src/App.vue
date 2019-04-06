<template>
    <div id="app">
        <md-toolbar class="md-primary">
            <div>
                <form class="form-inline">
                    <label>Action type &nbsp;</label>
                    <select id="type" class="form-control">
                        <option value="click" selected>Click</option>
                        <option value="singleclick">Single-click</option>
                        <option value="pointermove">Hover</option>
                        <option value="altclick">Alt+Click</option>
                        <option value="none">None</option>
                    </select>
                    <span id="status">&nbsp;0 selected features</span>
                </form>
            </div>
            <div class="md-toolbar-row">
                <div class="md-toolbar-section-start">
                    <md-button class="md-icon-button">
                        <md-icon>menu</md-icon>
                    </md-button>
                </div>
                <router-link class="md-button md-raised md-accent" to="/">Main</router-link>
                <router-link class="md-button md-raised md-accent" to="/about">Map</router-link>
                <router-link class="md-button md-raised md-accent" to="/example">Example</router-link>
                <div class="md-toolbar-section-end">
                    <md-button class="md-icon-button">
                        <md-icon>refresh</md-icon>
                    </md-button>

                    <md-button class="md-icon-button">
                        <md-icon>more_vert</md-icon>
                    </md-button>
                </div>
            </div>
        </md-toolbar>
        <router-view/>
    </div>
</template>

<style>

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>
