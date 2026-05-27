---
title: "Criando Kernel Patches para BSPs no Yocto Project utilizando devtool"
categories: 
  - "artigos"
draft: true
---

![](images/WhatsApp-Image-2024-03-22-at-17.44.36.jpeg)

## O problema

É comum quando trabalhamos com BSPs de fabricantes (NXP, TI, Toradex, Variscite e etc) que as versões receitas de kernel geralmente são fornecidas com patches que cada fabricante acredita ser o melhor para o seu hardware. Se desejamos faz modificações podemos fazer de diversas maneiras. Nesse artigo vamos explorar algumas formas e também oferecer a que acredito que seja mais produtiva em um cenário com Yocto Project.

## Abordagem tradicional

A forma mais tradicional de gerar patches para um kernel é, baixar a versão, branch e commit hash que você deseja trabalhar e começar a criar patches para essa versão.

```
git clone -b [versao] git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
```

Vamos fazer isso para o BSP da Toradex que utiliza uma versão do kernel mainline (6.1.55)

```
git clone -b v6.1.55 git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
```

depois disso precisamos encontrar os patches que o fabricante aplicou para isso fazemos:

HASH para BSP6.0 é: _7b2a41b8da74d7b783cb5a15ba945ebdb9b57f26_ [https://developer.toradex.com/linux-bsp/os-development/build-u-boot-and-linux-kernel-from-source-code/build-linux-kernel-from-source-code/#downstream-based-kernel](https://developer.toradex.com/linux-bsp/os-development/build-u-boot-and-linux-kernel-from-source-code/build-linux-kernel-from-source-code/#downstream-based-kernel)

```
mkdir -p  linux/patches
```

```
git clone https://git.toradex.com/cgit/meta-toradex-bsp-common.gitcd meta-toradex-bsp-commongit checkout 7b2a41b8da74d7b783cb5a15ba945ebdb9b57f26cp -r ../meta-toradex-bsp-common/recipes-kernel/linux/linux-toradex-mainline-git/* ../patches
```

```
cd ~/linux/patches
git am *.patch
```

Após isso, nós podemos criar novos patchs e fazer alteração nessa versão do kernel. Estamos nessa situação com uma versão em alinhada com a versão fornecida com fabricante.

A partir daí podemos criar **linux-toradex-mainline\_git.bbappends** e incluir suas mudanças com certeza de que tudo está com sincronia.

Você pode conferir em mais detalhes aqui: [https://developer.toradex.com/linux-bsp/os-development/build-u-boot-and-linux-kernel-from-source-code/build-linux-kernel-from-source-code/#bsp6.0.0](https://developer.toradex.com/linux-bsp/os-development/build-u-boot-and-linux-kernel-from-source-code/build-linux-kernel-from-source-code/#bsp6.0.0)  

## Utilizando o DevTool

Vimos uma forma mais tradicional para criar patches em alinhamento com o kernel do BSP do fornecedor. Mas, podemos fazer isso de uma forma muito mais simples e automatizada utilizando [DevTool do Yocto Project](https://docs.yoctoproject.org/4.0.17/ref-manual/devtool-reference.html).

Para isso nós precisamos baixar o BSP completo do fabricante (para caso da Toradex utilizamos a feramenta repo para baixar o conjunto de repositórios necessários).

```
mkdir ~/binexport PATH=~/bin:$PATHcurl https://commondatastorage.googleapis.com/git-repo-downloads/repo > ~/bin/repochmod a+x ~/bin/repo
```

```
mkdir ${HOME}/oe-core
cd ${HOME}/oe-core
repo init -u git://git.toradex.com/toradex-manifest.git -b kirkstone-6.x.y -m tdxref/default.xml
repo sync
. export

Vamos utilizar o devtool para começar as nossas mudanças no kernel, para isso rodamos os seguinte comando:

devtool modify linux-toradex-mainline
```

isso irá criar uma pasta chamada **workspace**, com a seguinte estrutura

```
.├── appends├── conf├── README└── sources
```

Podemos encontrar em sources, uma pasta chamada **linux-toradex-mainline**.

Essa pasta é um repositório já com a aplicação dos patchs fornecidos pelo BSP do fabricante.

podemos conferir com:

```
git log --oneline
```

```
4a81d25c32f6 (HEAD -> linux-6.1.y, tag: devtool-patched) usb: gadget: f_ncm: Apply workaround for packet clogging
41e7274e8a62 wifi: mwifiex: configure BSSID consistently when starting AP
37fd45f65671 arm64: dts: freescale: verdin-imx8mm: add support to mallow board
e6a6ccdbeffc arm64: dts: freescale: verdin-imx8mp: add support to mallow board
278230ccafbf ARM: dts: imx6q-apalis: add can power-up delay on ixora board
d43923310349 power: reset: gpio-poweroff: make sys handler priority configurable
abf13ffa0354 dt-bindings: power: reset: gpio-poweroff: Add priority property
6c146cc70e5f power: reset: gpio-poweroff: use sys-off handler API
bb797a94caf6 power: reset: gpio-poweroff: use a struct to store the module variables
03671d62c58f Revert "media: v4l2-async: Use endpoints in __v4l2_async_nf_add_fwnode_remote()"
69c14b70ba03 media: i2c: ov5640: Implement get_mbus_config
2e704478744f media: v4l2-async: fix binding async subdevs with multiple source ports
6c691936325d arm64: dts: imx8mp-verdin: Add yavia carrier board
ef63bc5793c5 arm64: dts: imx8mm-verdin: Add yavia carrier board
591c054ff398 ARM: dts: colibri-imx7: Disable usb over-current
ef9bfeb25ddc ARM: dts: colibri-imx6ull: Disable usb over-current
8bdb8b694e14 ARM: dts: colibri-imx6: Disable usb over-current
dff969f13141 ARM: dts: apalis-imx6: Disable usb over-current
97b449813898 drivers: chipidea: disable runtime-pm for imx6ul
56799cd28204 ARM: dts: colibri-imx6ull: Enable dual-role switching
33bd3b413e87 arm: dts: colibri-imx6ull: enable default peripherals
7cce1a5a8870 arm: dts: colibri-imx6ull: keep peripherals disabled
9c40bdd18179 arm: dts: colibri-imx6: specify usbh_pen gpio being active-low
d3640495fc10 arm: dts: colibri-imx6: move vbus-supply to module level device tree
b1e905494a1f arm: dts: colibri-imx6: usb dual-role switching
ae8c66206016 Revert "drm/panel-simple: drop use of data-mapping property"
1e4f73b1bf38 thermal: imx: Update critical temp threshold
38fb82ecd144 (tag: v6.1.71, tag: devtool-base, devtool-orig) Linux 6.1.71
```

A partir desse momento podemos fazer alterações e gerar patches com segurança.

Com esses patchs podemos colocá-los em uma futura layer de customização com nossas mudanças e mantendo a compatilidade.

TODO

Como podemos ver utilizar o [**DevTool**](https://docs.yoctoproject.org/ref-manual/devtool-reference.html) facilita bastante para criar novos patches e criar novas correções!

Esse workflow também pode ser utilizado para outros códigos, além do kernel como por exemplo o [busybox](https://www.busybox.net/)

Segue um vídeo explicando o processo:

\[VIDEO\]

Happy Hacking!
