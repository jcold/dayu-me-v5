---
id: 1694253465324
created_at: 2023-09-09 17:57
slug: k8s-tips
---

三年前，常规坐班时用的K8S，时过境迁，自己做时，才发现没哪个体量时，单体应用是很不错的，之前用过的一些命令片段，先不作整理了。

```bash
kc exec platform-app-deployment-7557886f6-mkk2m -c istio-proxy -- curl -s http://127.0.0.1:15000/clusters | grep -iE "(req|connect)" | grep adt-c-api

-c istio-proxy  curl http://127.0.0.1:15000/help

 kc exec platform-app-deployment-54fd647788-7gk57 -c istio-proxy  curl http://127.0.0.1:15000/clusters

 kc exec mp-app-deployment-57874b7c7f-27blx -c istio-proxy  curl http://127.0.0.1:15000/clusters | grep max_conn | grep mp-app

 kc exec mp-app-deployment-57874b7c7f-27blx -c istio-proxy  curl http://127.0.0.1:15000/clusters | grep -iE "(req|connect)" | grep adt-c-api


 kc port-forward mp-app-deployment-57874b7c7f-27blx 15000
 kc port-forward passport-service-deployment-f6995948d-s4x2p 15000
 kc port-forward passport-service-deployment-f6995948d-s4x2p 5097

 curl -X POST "localhost:15000/logging?level=info"
 curl -X POST "localhost:15000/logging?upstream=trace"


 kc exec -ti  m-app-deployment-69dd697bb6-kf5fw -c istio-proxy -- curl -XPOST http://localhost:15000/logging\?router\=trace

 kubectl exec  $(kubectl get pods -l app=passport-service -o jsonpath='{.items[0].metadata.name}') -c istio-proxy -- curl localhost:15000/config_dump -s | code -

 istioctl proxy-status | grep passport

 eval 'kubectl --context='{aliyun-test2}' --namespace='{default,cron,server}' get pod;'






 kc get deploy,cj,svc --all-namespaces --no-headers


 kc get deploy,cj --all-namespaces --no-headers | awk  '{print $2}'

 kubectl get pods --all-namespaces -o go-template --template='{{range .items}}{{.metadata.uid}}{{end}}'

 kubectl describe pods -l appgroup=cas-app -o go-template --template='{{range .items}}{{.Node}}{{end}}'
```