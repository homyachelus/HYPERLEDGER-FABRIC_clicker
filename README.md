# HYPERLEDGER-FABRIC_clicker

## 1. Разворачиваю сеть

### I. Установка Hyperledger Fabric:
```bash
  curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
  
  ./install-fabric.sh d s b
```

Должны устновиться папка `fabric-samples` и файл `install-fabric`

### II. Далее сделать изменения в файлах:
1) `configtx.yaml` в папке `fabric-samples\test-network\compose\compose-test-net.yaml` строки **&Org1** и **&Org2** и меняем на нужные организации из ТЗ
2) `compose-test-net.yaml` в папке `fabric-samples\test-network\configtx\configtx.yaml` ищем строки **CORE_PEER_LOCALMSPID=Org1MSP**, **CORE_PEER_LOCALMSPID=Org2MSP** и меняем Org1MSP и Org2MSP на организации
3) `ccp-generate.sh` в папке `fabric-samples\test-network\organizations` в функцию yaml_ccp и json_ccp добавляем строку `-e "s#\${ORGNAME}#$6#" \`
и также сделать изменения в `ccp-generate.json` и `ccp-generate.yaml`
4) в папке `fabric-samples\test-network\scripts` вносим изменения в `deployCC.sh`, `deployCCAAS.sh` и `envVar.sh`
5) и остался файл `network.sh`, где в **CHANNEL_NAME** пишем **CHANNEL_NAME="blockchain2025"**

*см. в файлах*

### III. Запуск:
```shell
#создаем сеть
./network.sh up -ca
#создаем канал блокчейна
./network.sh up createChannel -ca -c blockchain2025
```
Должно вывестись *Channel 'blockchain2025' joined*. И появиться файл `connection-org1.json` в папке `organizations/peerOrganizations/org1.example.com/`

## 2. Пишу смарт-контракт 

### I. Настройка и установка зависимостей:
```shell
#тут будет контракт
mkdir chaincode
cd chaincode
npm init -y
npm install --save-dev typescript @types/node
npx tsc --init
npm install fabric-contract-api
```

В файле `tsconfig.json` меняем значение с **true** на **false** в строках:
* exactOptionalPropertyTypes
* strict
* verbatimModuleSyntax

Создаем файлы `contract.ts` и `index.ts`

### II. Написание смарт-контракта

Работаем в `contract.ts`

**stub.PutState(key, value)** - это функция API чейнкода, которая сохраняет пару ключ-значение в состояние блокчейна.

* https://hyperledger-fabric.readthedocs.io/ru/latest/smartcontract/smartcontract.html

Импортируем Contract - шаблон умного контракта, Context - тут лежат все инструменты для работы с блокчейном.
Создаем класс, наследуемый от умного контракта из, в нем создаем функцию с параметром типа Context.
Там указываем счетчик и с помощью **ctx.stub.putState** сохраняем в ключ - клик значение нашего клика в байтах в формате json

```typescript
import {Contract, Context} from "fabric-contract-api";

export class ClickerContract extends Contract {
    public async init(ctx: Context) {
        const clicked = {click: 0};
        await ctx.stub.putState('CLICK-', Buffer.from(JSON.stringify(clicked))) (6)
    }
}
```

```typescript
public async queryAll<T = string>(ctx:Context, prefix:string): Promise<T[]> {
    const allResults = [];
    for await(const{key,value} of ctx.stub.getStateByRange('','')){
        const strValue = Buffer.from(value).toString('utf-8');
        let record;
        try {
            record = JSON.parse(strValue);
        } catch (error) {
            console.log(error);
            record = strValue;
        }
        if (key.startsWith(prefix)){
            allResults.push(record as T);
        }
    }
    console.info(allResults);
    return allResults;
}

// и использовать его как:
public async getClicked(ctx:Context): Promise<Clicker> {
    return (await this.queryAll<Clicker>(ctx,'CLICKED-'))[0];
}
```
> ! Заучить код для получения данных из блокчейна ^

### III. Вход в контракт

В файле `index.ts` импортируем и экпортируем написанный контракт для схода в него 

Все что нужно сделать:
```typescript
import {ClickerContract} from "./contract";
export {ClickerContract} from "./contract";

export const contracts: any[] = [ClickerContract];
```

Для парвильного запуска добавляем такие параметры в **scripts** в `package.json`:
```json
"start": "fabric-chaincode-node start",
"build": "tsc"
```

## ЗАПУСК

* https://hyperledger-fabric.readthedocs.io/ru/latest/write_first_app.html

```shell
./network.sh down
./network.sh up -ca
./network.sh up createChannel -ca -c blockchain2025
./network.sh deployCC -ccn blockchain -ccl typescript -ccv 1.0 -ccs 1 -ccp ../chaincode -cci init
```
