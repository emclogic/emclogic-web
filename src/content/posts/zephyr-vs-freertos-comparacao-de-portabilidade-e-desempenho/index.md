---
title: "Zephyr vs FreeRTOS: comparação de portabilidade e desempenho"
date: 2025-02-28
categories: 
  - "artigos"
tags: 
  - "microcontroladores"
  - "rtos"
  - "zephyr"
coverImage: "ZEPHYRFREERTOS.png"
---

Em Fevereiro desse ano a AMD postou um guia oficial sobre as vantagens de se utilizar o Sistema Operacional de Tempo Real (RTOS) Zephyr, destacando todas as suas qualidades para que os usuários possam fazer a portabilidade a partir do FreeRTOS.

Nesse artigo vou resumir os principais pontos apresentados pela AMD que evidenciam porque o Zephyr se tornou uma das melhores opções para quem programa microcontroladores.

## Destaques

**1 - Modularidade:** sua arquitetura é organizada em módulos independentes. Isso significa que podem ser adaptados e configurados conforme as necessidades do hardware. Se mais para frente no seu projeto for necessária a mudança de hardware, basta ajustar os módulos especificos (como os drivers, por exemplo), facilitando a portabilidade. No caso do FreeRTOS pode ser necesasário um ajuste significativo no código dependendo do projeto.

**2 - Interface integrada de drivers:** com APIs especificas para cada tipo de hardware, os drivers são implementados independentemente da plataforma, ou seja, eles podem ser desenvolvidos de forma isoladas e serem integrados sem precisar modificar o sistema operacional por completo. O FreeRTOS não possui essa interface de drivers, tornando mais dependente da plataforma para o qual aquele projeto foi desenvolvido.

**3 - Protocolos de rede nativos:** os protocolos de comunicação em rede (TCP/IP, IPv4, ICMP, HTTP, entre outros...) já vêm nativos e otimizados para dispositivos embarcados. Não é necessário buscar uma biblioteca externa, como seria no caso do FreeRTOS, o que melhora o desempenho do equipamento que está sendo desenvolvido.

## Vantagens

O artigo da AMD destaca que as vantagens do FreeRTOS são a sua curva de aprendizado (menor do que a do Zephyr) e o fato de que ele é minimalista, ideal para dispositivos que tem poucos recursos.

Além dos destaques já levantados, o Zephyr traz:  
\- suporte a uma grande quantidade de subsistemas: USB, filesystem, registro de eventos (log) e a atualização de firmware do dispositivo (DFU)  
\- alocação estática de memória e recursos  
\- mecanismos de proteção da memória do sistema operacional para evitar erros que possam comprometer a estabilidade do sistema, como impedir que uma thread utilize mais memória do que o permitido, controlar recursos críticos ao sistema, entre outros  
\- suporte tanto ao escalonamento cooperativo quanto ao preemptivo

## **Código**

A arquitetura do FreeRTOS exige que cada componente (timer, task, etc...) seja adicionado no código por diretivas de #include. Isso inclui algumas específicas da AMD, como mostrado no código abaixo pelos comandos `#include "xil_printf.h"` e `#include "xparameters.h"`, esse último sendo necessário para que a aplicação possa obter informações do hardware.

```
// Diretivas de Include do FreeRTOS
#include "FreeRTOS.h" 
#include "task.h"
#include "queue.h"
#include "timers.h"

// Xilinx includes - específicas da AMD  
#include "xil_printf.h" 
#include "xparameters.h"
```

Já no caso do Zephyr, a maior parte dos componentes estão inclusos no arquivo kernel.h e as informações do Hardware vão ser obtidas através do Device Tree específico dele.

O Device Tree é uma estrutura de dados hierárquica que é usada para descrever o Hardware e é normalmente fornecido pelo próprio fabricante. Através dele é possível configurar a maior parte dos componentes necessários no Zephyr e depois basta referenciar o arquivo dessa estrutura no código.

```
// Diretivas de Include do Zephyr  
#include <zephyr/kernel.h> 
#include <zephyr/sys/printk.h>
#include <zephyr/devicetree.h>

// Acessando um periférico descrito no arquivo do Device Tree
#define SW1 DT_NODELABEL(button_backlight)
const struct gpio_dt_spec sw_backlight = GPIO_DT_SPEC_GET(SW1,gpios);
```

O artigo também destaca algumas diferenças entre o código do Zephyr e do FreeRTOS para ilustrar todos os pontos levantados acima, assim como uma tabela de comparação que referencia a documentação do Zephyr e que é uma base excelente para quem deseja fazer a portabilidade.

## Fonte

[\[1\] AMD's FreeRTOS to Zephyr Porting Overview](https://docs.amd.com/r/en-US/wp560-rtos-zephyr-porting/Abstract)
