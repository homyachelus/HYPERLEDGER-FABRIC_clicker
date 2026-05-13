# HYPERLEDGER-FABRIC_clicker

## 1. Разворачиваю сеть

### I. Установка Hyperledger Fabric:
```bash
1) 
  curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh

2) 
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
