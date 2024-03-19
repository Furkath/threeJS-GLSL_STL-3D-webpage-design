for n in {1..200};
do
   echo $n.json
   sed -i "s/Fork of Nuetral/$n/g" $n.json
   #cp 0.json $n.json 
   
done
