### ¡Bienvenidos!

Esta es una plataforma que usaremos para los cursos libres del **Club de Ciencia de Datos**

<img class="responsive-img" src="https://i.imgur.com/Pr5nbGm.png" alt="home-img">

No requiere registro para el acceso al contenido :D

> **Nunca pares de aprender**

```python
from dataclasses import dataclass, field
from typing import List

things_to_learn = [ ... ]

@dataclass
class Student(You):
	learned: List[str] = field(default_factory=list)

	def learn(self, subject):
		self.learned.append(subject)
		
if __name__ == '__main__':
	student = Student()

	while len(things_to_learn) > 0:
		student.learn(things_to_learn.pop(0))
```
