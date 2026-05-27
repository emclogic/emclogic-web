---
title: "Explorando DevTool –  Desenvolvimento rápido com Yocto Project"
categories: 
  - "artigos"
draft: true
---

O devtool é uma ferramenta de linha de comando que auxilia criar receitas, buildar, editar  e testar pacotes de software. Essa ferramenta é uma peça chave do SDK criado através do Yocto.

Análise da ferramenta:

```
devtool -h

NOTE: Starting bitbake server...

usage: devtool [--basepath BASEPATH] [--bbpath BBPATH] [-d] [-q] [--color COLOR] [-h] <subcommand> ...

OpenEmbedded development tool

options:

  --basepath BASEPATH   Base directory of SDK / build directory

  --bbpath BBPATH       Explicitly specify the BBPATH, rather than getting it from the metadata

  -d, --debug           Enable debug output

  -q, --quiet           Print only errors

  --color COLOR         Colorize output (where COLOR is auto, always, never)

  -h, --help            show this help message and exit

subcommands:

  Beginning work on a recipe:

    add                   Add a new recipe

    modify                Modify the source for an existing recipe

    upgrade               Upgrade an existing recipe

  Getting information:

    status                Show workspace status

    latest-version        Report the latest version of an existing recipe

    check-upgrade-status  Report upgradability for multiple (or all) recipes

    search                Search available recipes

  Working on a recipe in the workspace:

    build                 Build a recipe

    rename                Rename a recipe file in the workspace

    edit-recipe           Edit a recipe file

    find-recipe           Find a recipe file

    configure-help        Get help on configure script options

    update-recipe         Apply changes from external source tree to recipe

    reset                 Remove a recipe from your workspace

    finish                Finish working on a recipe in your workspace

  Testing changes on target:

    deploy-target         Deploy recipe output files to live target machine

    undeploy-target       Undeploy recipe output files in live target machine

    build-image           Build image including workspace recipe packages

  Advanced:

    create-workspace      Set up workspace in an alternative location

    extract               Extract the source for an existing recipe

    sync                  Synchronize the source tree for an existing recipe

    menuconfig            Alter build-time configuration for a recipe

    import                Import exported tar archive into workspace

    export                Export workspace into a tar archive

  other:

    selftest-reverse      Reverse value (for selftest)

    pluginfile            Print the filename of this plugin

    bbdir                 Print the BBPATH directory of this plugin

    count                 How many times have this plugin been registered.

    multiloaded           How many times have this plugin been initialized

Use devtool <subcommand> --help to get help on a specific command
```

Por definição o  devtool cria um workspace onde estará as receitas, os append e o código fonte do pacotes que desejamos trabalhar:

Hanson:

Criar uma receita para um módulo go, compilar, inserir e retirar de um target (qemuarm), finalizar a receita e colocar em uma layer, editar o código fonte e re testar no target, fazer um commit e gerar um patch para a receita.
