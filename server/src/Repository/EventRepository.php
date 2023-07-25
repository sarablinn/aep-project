<?php

namespace App\Repository;

use App\Entity\Event;
use Cassandra\Date;
use DateInterval;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Event>
 *
 * @method Event|null find($id, $lockMode = null, $lockVersion = null)
 * @method Event|null findOneBy(array $criteria, array $orderBy = null)
 * @method Event[]    findAll()
 * @method Event[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }

    public function save(Event $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Event $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Returns an array of Events that are in progress.
     *
     * @return Event[] Returns an array of Event objects
     */
    public function findByCurrentDate(DateTime $datetime): array
    {
        return $this->createQueryBuilder('e')
            ->andWhere(':datetime between e.start_date and e.end_date')
            ->setParameter('datetime', $datetime)
            ->orderBy('e.event_id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * Returns an array of Events that ended within 7 days from system date.
     *
     * @return Event[] Returns an array of Event objects
     */
    public function findEventsEndedWeekPrior(): array
    {
//        $dateInterval = new DateInterval('P7D');
//        $priorWeek = $endPeriod->sub($dateInterval);

        return $this->createQueryBuilder('e')
            ->andWhere('e.end_date between (current_date() - 7) and current_date()')
            ->orderBy('e.end_date', 'ASC')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * Returns an array of Events that start after the given date.
     *
     * @return Event[] Returns an array of Event objects
     */
    public function findFutureEvents(DateTime $startDate): array
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.start_date > :startDate')
            ->setParameter('startDate', $startDate)
            ->orderBy('e.start_date', 'ASC')
            ->getQuery()
            ->getResult()
            ;
    }

//    /**
//     * @return Event[] Returns an array of Event objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('e')
//            ->andWhere('e.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('e.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Event
//    {
//        return $this->createQueryBuilder('e')
//            ->andWhere('e.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
