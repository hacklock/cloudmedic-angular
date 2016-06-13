/**
 * This file/module contains all configuration for the deploy process.
 */
module.exports = {
    // these are used by grunt-ng-contant to dynamically assemble our APP_CONFIG based on environment
    ngconstant: {
        // Options for all targets
        options: {
            space: '  ',
            name: 'cloudmedic.config'
        },
        // Environment targets
        development: {
            options: {
                dest: '<%= build_dir %>/<%= app_config %>'
            },
            constants: {
                APP_CONFIG: {
                    environment: 'development',
                    api_url: 'https://api.cloudmedic.io/',
                    base_uri: 'https://demo.cloudmedic.io/',
                    externalAssets: true
                }
            },
            data: {
                server: 'apache'
            }
        },
        staging: {
            options: {
                dest: '<%= build_dir %>/<%= app_config %>'
            },
            constants: {
                APP_CONFIG: {
                    environment: 'staging',
                    api_url: 'https://api.cloudmedic.io/',
                    base_uri: '',
                    externalAssets: true
                }
            },
            data: {
                server: 'apache'
            }
        },
        production: {
            options: {
                dest: '<%= build_dir %>/<%= app_config %>'
            },
            constants: {
                APP_CONFIG: {
                    environment: 'production',
                    api_url: 'https://api.cloudmedic.io/',
                    base_uri: 'https://demo.cloudmedic.io/',
                    externalAssets: true
                }
            },
            data: {
                server: 'iis'
            }
        }
    }

};
